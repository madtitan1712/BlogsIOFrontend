import { useState, useEffect } from 'react';
import { SearchBar, Pagination, Spinner } from '../components/ui';
import PostCard from '../components/posts/PostCard';
import PostService from '../services/PostService';
import { mockPosts } from '../data/mockPosts'; // Import mock data as fallback
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/layout/Footer';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSort, setCurrentSort] = useState('createdAt,desc');
  const [activeTag, setActiveTag] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 1,
    totalElements: 0,
  });

  // Fetch posts from real API with fallback to mock data
  const fetchPosts = async (page = 0, sort = currentSort, tag = activeTag, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      
      try {
        // Determine which API call to make based on parameters
        if (tag) {
          // If tag is present, call getPostsByTag
          response = await PostService.getPostsByTag(tag, page, 10, sort);
        } else if (search) {
          // If search but no tag, call getAllPosts with search
          response = await PostService.getAllPosts(page, 10, sort, search);
        } else {
          // Default: get all posts normally
          response = await PostService.getAllPosts(page, 10, sort);
        }
        
        // Set posts and pagination data from the response
        if (response && response.content) {
          setPosts(response.content);
          setPagination({
            currentPage: response.number || 0,
            totalPages: response.totalPages || 1,
            totalElements: response.totalElements || 0,
          });
        } else {
          console.warn('API response is missing content array, falling back to mock data');
          loadMockData(search, tag);
        }
      } catch (apiError) {
        console.error('Error fetching from API, falling back to mock data:', apiError);
        loadMockData(search, tag);
      }
    } catch (err) {
      console.error('Error in fetchPosts:', err);
      setError('Failed to fetch posts. Please try again later.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to load mock data
  const loadMockData = (search = '', tag = null) => {
    // Set a warning that we're using mock data
    setError('⚠️ Unable to connect to the backend API. Using mock data for demonstration purposes.');
    
    // Filter mock posts based on search and tag
    let filteredPosts = mockPosts.content;
    
    // Filter by tag first if specified
    if (tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags && post.tags.some(postTag => 
          postTag.toLowerCase() === tag.toLowerCase()
        )
      );
    }
    
    // Then filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) || 
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(postTag => postTag.toLowerCase().includes(searchLower))
      );
    }
    
    setPosts(filteredPosts);
    setPagination({
      currentPage: mockPosts.number || 0,
      totalPages: mockPosts.totalPages || 1,
      totalElements: filteredPosts.length,
    });
  };

  // Initialize by fetching posts and re-fetch when sort, tag, or search changes
  useEffect(() => {
    fetchPosts(0, currentSort, activeTag, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSort, activeTag, searchTerm]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setActiveTag(null); // Clear tag filter when searching
    fetchPosts(0, currentSort, null, term); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (page) => {
    // API pagination is 0-based, but our UI is 1-based
    fetchPosts(page - 1, currentSort, activeTag, searchTerm);
  };

  // Handle tag click
  const handleTagClick = (tag) => {
    setActiveTag(tag);
    setSearchTerm(''); // Clear search when filtering by tag
    fetchPosts(0, currentSort, tag, ''); // Reset to first page when filtering by tag
  };

  // Clear tag filter
  const clearTagFilter = () => {
    setActiveTag(null);
    fetchPosts(0, currentSort, null, searchTerm);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setCurrentSort(newSort);
    fetchPosts(0, newSort, activeTag, searchTerm); // Reset to first page when changing sort
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 text-center fade-in">
        <h1 className="font-sans text-4xl font-bold mb-3">
          {isAuthenticated() && user ? `Welcome ${user.name}` : 'Welcome to BlogsIO'}
        </h1>
        <p className="font-serif text-lg opacity-75 max-w-2xl mx-auto">
          Where words bloom like flowers in the garden of thoughts
        </p>
      </div>
      
      <div className="mb-8 max-w-md mx-auto fade-in-down">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search posts..."
          className="shadow-medium"
        />
      </div>

      {/* Active Tag Display */}
      {activeTag && (
        <div className="mb-8 text-center fade-in">
          <div className="inline-flex items-center bg-accent-light dark:bg-accent-dark text-accent-dark dark:text-accent-light px-5 py-3 rounded-xl shadow-sm border border-accent/20 backdrop-blur-sm">
            <svg className="w-4 h-4 mr-2 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="font-sans text-sm font-medium mr-2">Filtering by tag:</span>
            <span className="font-serif font-semibold text-accent">#{activeTag}</span>
            <button
              onClick={clearTagFilter}
              className="ml-3 flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 hover:bg-accent/30 text-accent hover:text-accent-dark transition-all duration-200 text-sm font-bold"
              title="Clear tag filter"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Sorting Controls */}
      <div className="mb-8 text-center fade-in">
        <div className="inline-flex bg-background border border-border-color rounded-xl shadow-sm overflow-hidden backdrop-blur-sm">
          <button
            onClick={() => handleSortChange('createdAt,desc')}
            className={`px-6 py-3 font-medium font-sans text-sm transition-all duration-200 ${
              currentSort === 'createdAt,desc'
                ? 'bg-accent text-white shadow-sm'
                : 'text-text-primary hover:bg-accent/10 hover:text-accent'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Newest First
            </span>
          </button>
          <div className="w-px bg-border-color"></div>
          <button
            onClick={() => handleSortChange('title,asc')}
            className={`px-6 py-3 font-medium font-sans text-sm transition-all duration-200 ${
              currentSort === 'title,asc'
                ? 'bg-accent text-white shadow-sm'
                : 'text-text-primary hover:bg-accent/10 hover:text-accent'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
              Title (A-Z)
            </span>
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="py-10 text-center fade-in">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className={`p-6 rounded-lg shadow-medium mb-8 fade-in ${
          error.includes('⚠️')
            ? "bg-yellow-50 border-l-4 border-yellow-500" 
            : "bg-red-50 border-l-4 border-red-500"
        }`}>
          <p className={error.includes('⚠️') ? "text-yellow-700" : "text-red-700"}>
            {error}
          </p>
        </div>
      ) : posts.length > 0 ? (
        <div className="fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 stagger-fade-in">
            {posts.map((post, index) => (
              <div key={post.id} className={`modern-card shadow-medium fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
                <PostCard post={post} onTagClick={handleTagClick} />
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center fade-in-up">
            <Pagination
              currentPage={pagination.currentPage + 1} // Convert to 1-based for UI
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-16 fade-in">
          <div className="modern-card max-w-xl mx-auto p-8">
            <p className="font-serif text-lg mb-4">
              {searchTerm 
                ? `No posts found for "${searchTerm}". Try a different search term.`
                : 'No posts available yet. Check back later!'}
            </p>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
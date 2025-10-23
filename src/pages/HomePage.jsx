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
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 1,
    totalElements: 0,
  });

  // Fetch posts from real API with fallback to mock data
  const fetchPosts = async (page = 0, search = '') => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching posts with params:', { page, size: 10, sort: 'createdAt,desc', search });
      
      try {
        // Try to call the real API first
        const response = await PostService.getAllPosts(
          page,
          10, // posts per page
          'createdAt,desc', // sort by creation date, descending
          search // search term if any
        );
        
        console.log('API response:', response);

        // Set posts and pagination data from the response
        if (response && response.content) {
          setPosts(response.content);
          setPagination({
            currentPage: response.number || 0,
            totalPages: response.totalPages || 1,
            totalElements: response.totalElements || 0,
          });
          console.log('Posts loaded from API:', response.content.length);
        } else {
          console.warn('API response is missing content array, falling back to mock data');
          loadMockData(search);
        }
      } catch (apiError) {
        console.error('Error fetching from API, falling back to mock data:', apiError);
        loadMockData(search);
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
  const loadMockData = (search = '') => {
    console.log('Using mock data as fallback');
    
    // Set a warning that we're using mock data
    setError('⚠️ Unable to connect to the backend API. Using mock data for demonstration purposes.');
    
    // Filter mock posts if search term is provided
    let filteredPosts = mockPosts.content;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = mockPosts.content.filter(post => 
        post.title.toLowerCase().includes(searchLower) || 
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    setPosts(filteredPosts);
    setPagination({
      currentPage: mockPosts.number || 0,
      totalPages: mockPosts.totalPages || 1,
      totalElements: mockPosts.totalElements || 0,
    });
    
    console.log('Mock posts loaded:', filteredPosts.length);
  };

  // Initialize by fetching posts
  useEffect(() => {
    // Create a memoized version of fetchPosts that doesn't change
    const initialFetch = () => {
      fetchPosts(0, '');
    };
    
    initialFetch();
    // We intentionally leave the dependency array empty to only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchPosts(0, term); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (page) => {
    // API pagination is 0-based, but our UI is 1-based
    fetchPosts(page - 1, searchTerm);
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
                <PostCard post={post} />
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
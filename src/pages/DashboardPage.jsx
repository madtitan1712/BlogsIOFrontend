import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PostService from '../services/PostService';

// Components
import { Spinner, Button, Pagination } from '../components/ui';
import ErrorAlert from '../components/ui/ErrorAlert';
import Footer from '../components/layout/Footer';


const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  
  // Fetch user's posts on component mount and when pagination changes
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Convert 1-based page (UI) to 0-based page (API)
        const apiPageIndex = currentPage - 1;
        const data = await PostService.getMyPosts(apiPageIndex, pageSize);
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error('Error fetching my posts:', err);
        setError('Failed to load your posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: { pathname: "/dashboard" } }} />;
  }
  
  // Additional role check to ensure only AUTHOR or ADMIN can access (case-insensitive)
  if (user?.role && user.role.toUpperCase() !== 'AUTHOR' && user.role.toUpperCase() !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="mb-4">You don't have permission to access the Author Dashboard.</p>
        <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg mb-4 text-xs text-left max-w-lg mx-auto">
          User role: {user?.role || 'undefined'}{'\n'}
          Required roles: AUTHOR, ADMIN
        </pre>
        <Link to="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          Return to Home
        </Link>
      </div>
    );
  }
  
  // Access control is now handled by both ProtectedRoute component and the check above

  return (
    <div className="fade-in">      
      <div className="flex justify-between items-center mb-8">
        <div className="fade-in-up">
          <h1 className="text-3xl font-bold text-primary dark:text-primary-dark">My Posts</h1>
          {user && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome, {user.name} ({user.role || 'No role assigned'})
            </p>
          )}
        </div>
        <Link to="/editor" className="fade-in-right">
          <Button>Create New Post</Button>
        </Link>
      </div>

      
      {error && <ErrorAlert message={error} />}
      
      {loading ? (
        <div className="flex justify-center py-20 fade-in">
          <Spinner size="lg" />
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 stagger-fade-in">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index} 
                                className="inline-block px-2 py-0.5 text-xs bg-secondary/10 text-secondary dark:bg-secondary-dark/20 dark:text-secondary-dark rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {post.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <Link 
                          to={`/post/${post.id}`} 
                          className="text-primary hover:text-primary-dark dark:text-primary-dark dark:hover:text-primary"
                        >
                          View
                        </Link>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <Link 
                          to={`/editor/${post.id}`} 
                          className="text-primary hover:text-primary-dark dark:text-primary-dark dark:hover:text-primary"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8 fade-in-up">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-lg fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 fade-in-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white fade-in-slow">No posts yet</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400 fade-in-slow">Get started by creating your first post</p>
          <div className="mt-6 fade-in-up">
            <Link to="/editor">
              <Button>Create New Post</Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardPage;
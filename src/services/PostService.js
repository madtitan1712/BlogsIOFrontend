import api from './api';

// Service for post-related API calls
const PostService = {
  // Get all posts (paginated)
  getAllPosts: async (page = 0, size = 10, sort = 'createdAt,desc', search = '') => {
    const params = { page, size, sort };
    let endpoint = '/posts/getAll';
    if (search) {
      endpoint = '/posts/search';
      params.keyword = search; // Use 'keyword' parameter for search endpoint
      delete params.search; // Remove the old 'search' parameter if it exists
    }
    
    try {
      const response = await api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get a single post by ID
  getPostById: async (id) => {
    try {
      const response = await api.get(`/posts/getbyid/${id}`);
      
      console.log("API response for post:", response.data);
      
      // Get current user info for debugging
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log("Current user from localStorage:", currentUser);
      
      // Always ensure there's an authorId (for development purposes)
      if (!response.data.authorId) {
        console.log("Adding missing authorId to post data");
        if (response.data.author?.id) {
          response.data.authorId = response.data.author.id;
        } else if (response.data.author?.email) {
          response.data.authorId = response.data.author.email;
        } else if (response.data.username) {
          response.data.authorId = response.data.username;
        } else {
          // Last resort - use current user as fallback
          response.data.authorId = currentUser.id || currentUser.email || 'unknown';
        }
      }
      
      // Log the post with potentially added authorId
      console.log("Returning post with authorId:", response.data.authorId);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  },

  // Get posts by tag (paginated)
  getPostsByTag: async (tagName, page = 0, size = 10, sort = 'createdAt,desc') => {
    try {
      const response = await api.get(`/posts/tag/${encodeURIComponent(tagName)}`, {
        params: { page, size, sort }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts by tag ${tagName}:`, error);
      throw error;
    }
  },

  // Get current user's posts (my-posts)
  getMyPosts: async (page = 0, size = 10, sort = 'createdAt,desc') => {
    try {
      const response = await api.get('/posts/my-posts', { 
        params: { page, size, sort }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my posts:', error);
      throw error;
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      const response = await api.post('/posts/Create', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update an existing post
  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`/posts/update/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  },
};

export default PostService;
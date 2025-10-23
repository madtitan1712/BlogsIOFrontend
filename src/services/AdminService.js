import api from './api';

/**
 * AdminService provides methods for interacting with admin API endpoints
 */
class AdminService {
  /**
   * Get all users with pagination
   * 
   * @param {Object} options - Pagination options
   * @param {number} options.page - Page number (0-based)
   * @param {number} options.size - Page size
   * @param {string} options.sort - Sort field and direction (e.g., 'name,asc')
   * @returns {Promise<Object>} - Paginated list of users
   */
  static async getUsers(options = { page: 0, size: 10, sort: 'name,asc' }) {
    try {
      const { page, size, sort } = options;
      const response = await api.get(`/admin/users`, {
        params: { page, size, sort }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Update user role
   * 
   * @param {number} userId - The ID of the user to update
   * @param {string} newRole - The new role for the user ('ADMIN', 'AUTHOR', 'READER')
   * @returns {Promise<Object>} - Updated user data
   */
  static async updateUserRole(userId, newRole) {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId} role:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   * 
   * @param {number} userId - The ID of the user to delete
   * @returns {Promise<Object>} - Response data
   */
  static async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get dashboard statistics
   * 
   * @returns {Promise<Object>} - Dashboard statistics
   */
  static async getDashboardStats() {
    try {
      // Get users count
      const usersResponse = await api.get('/admin/users', {
        params: { page: 0, size: 1 }
      });
      const totalUsers = usersResponse.data.totalElements || 0;
      
      // Get comments count
      let totalComments = 0;
      try {
        const commentsResponse = await api.get('/admin/comments', {
          params: { page: 0, size: 1 }
        });
        totalComments = commentsResponse.data.totalElements || 0;
      } catch (err) {
        console.error('Error fetching comments count:', err);
      }
      
      // Get posts count (these might be placeholders if endpoints don't exist)
      let totalPosts = 0;
      let postsThisMonth = 0;
      try {
        const postsResponse = await api.get('/posts/getAll', {
          params: { page: 0, size: 1 }
        });
        totalPosts = postsResponse.data.totalElements || 0;
        
        // This is a placeholder for postsThisMonth
        // In a real app, you'd have a dedicated endpoint or query parameter
        postsThisMonth = Math.round(totalPosts * 0.15); // Just an estimate for display
      } catch (err) {
        console.error('Error fetching posts count:', err);
      }
      
      return {
        totalUsers,
        totalPosts,
        totalComments,
        postsThisMonth
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values on error
      return {
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0,
        postsThisMonth: 0
      };
    }
  }
  
  /**
   * Get recent posts for admin dashboard
   * 
   * @returns {Promise<Array>} - List of recent posts
   */
  static async getRecentPosts() {
    try {
      // In a real app, this would call a dedicated endpoint
      // For now we'll use the public posts endpoint with limit
      const response = await api.get('/posts/getAll', {
        params: { page: 0, size: 5, sort: 'createdAt,desc' }
      });
      return response.data.content || [];
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      return [];
    }
  }
  
  /**
   * Get recent comments for admin dashboard
   * 
   * @param {Object} options - Pagination options
   * @param {number} options.page - Page number (0-based)
   * @param {number} options.size - Page size
   * @param {string} options.sort - Sort field and direction (e.g., 'timeCreated,desc')
   * @returns {Promise<Object>} - Paginated list of comments
   */
  static async getRecentComments(options = { page: 0, size: 5, sort: 'timeCreated,desc' }) {
    try {
      const { page, size, sort } = options;
      const response = await api.get('/admin/comments', {
        params: { page, size, sort }
      });
      
      return response.data.content || [];
    } catch (error) {
      console.error('Error fetching recent comments:', error);
      return [];
    }
  }
}

export default AdminService;
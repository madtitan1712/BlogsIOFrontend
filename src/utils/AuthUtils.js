import { jwtDecode } from 'jwt-decode';

/**
 * Utility functions for authentication related tasks
 */
const AuthUtils = {
  /**
   * Get the numeric user ID from the JWT token if available
   * @returns {number|null} The numeric user ID or null if not found
   */
  getNumericUserId: () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) return null;
      
      const decoded = jwtDecode(token);
      return decoded.id ? Number(decoded.id) : null;
    } catch (error) {
      console.error('Error getting numeric user ID:', error);
      return null;
    }
  },
  
  /**
   * Get the stored user ID from localStorage
   * This is the most reliable source of the user ID as it's set by the profile API
   * @returns {number|null} The stored user ID or null if not found
   */
  getStoredUserId: () => {
    const storedId = localStorage.getItem('userId');
    return storedId ? Number(storedId) : null;
  },
  
  /**
   * Gets the current user's ID using the most reliable method available
   * @returns {number|null} Numeric user ID or null if not available
   */
  getCurrentUserId: () => {
    // First try to get userId from localStorage (set by profile API) - most reliable
    const storedId = AuthUtils.getStoredUserId();
    if (storedId !== null) {
      return storedId;
    }
    
    // Fallback to JWT token
    return AuthUtils.getNumericUserId();
  },
  
  /**
   * Ensures ID is converted to a numeric value when possible
   * @param {any} id - ID to convert
   * @returns {number|null} Numeric ID or null if conversion is not possible
   */
  ensureNumericId: (id) => {
    if (id == null) return null;
    
    // If id is an object, try to extract numeric id
    if (typeof id === 'object') {
      if (id.numericId && !isNaN(Number(id.numericId))) {
        return Number(id.numericId);
      }
      if (id.id && !isNaN(Number(id.id))) {
        return Number(id.id);
      }
      return null;
    }
    
    return !isNaN(Number(id)) ? Number(id) : null;
  },
  
  /**
   * Helper function to check if the current user is the author of a comment
   * @param {Object} comment - The comment object
   * @returns {boolean} True if current user is the author
   */
  isCurrentUserCommentAuthor: (comment) => {
    if (!comment || !comment.user) return false;
    
    const commentUserId = AuthUtils.ensureNumericId(comment.user.id);
    const currentUserId = AuthUtils.getCurrentUserId();
    
    return commentUserId !== null && 
           currentUserId !== null && 
           commentUserId === currentUserId;
  }
};

export default AuthUtils;
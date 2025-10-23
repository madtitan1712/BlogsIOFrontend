import api from './api';

// Service for comment-related API calls
const CommentService = {
  // Get all comments for a post
  getCommentsByPostId: async (postId) => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  },

  // Add a new comment to a post
  addComment: async (postId, commentText) => {
    try {
      const response = await api.post(`/comments/post/${postId}`, { commentText });
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to post ${postId}:`, error);
      throw error;
    }
  },

  // Update an existing comment
  updateComment: async (commentId, commentText) => {
    try {
      const response = await api.put(`/comments/update/${commentId}`, { commentText });
      return response.data;
    } catch (error) {
      console.error(`Error updating comment ${commentId}:`, error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/comments/delete/${commentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  },
};

export default CommentService;
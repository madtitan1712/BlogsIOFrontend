// Utility functions for debugging comment author checks
import AuthUtils from './AuthUtils';

/**
 * Get detailed comparison information between comment user ID and current user ID
 * This is used to help diagnose issues with comment author verification
 * 
 * @param {Object} comment - The comment object
 * @param {any} currentUserId - The current user ID
 * @returns {Object} - Detailed comparison information
 */
export const getCommentAuthorDebugInfo = (comment, currentUserId) => {
  const commentUserId = comment?.user?.id || null;
  const storedUserId = AuthUtils.getStoredUserId();
  
  // Get numeric IDs using AuthUtils for consistent handling
  const numericCommentUserId = AuthUtils.ensureNumericId(commentUserId);
  const numericCurrentUserId = AuthUtils.ensureNumericId(currentUserId);
  
  // Type checks
  const commentUserIdType = typeof commentUserId;
  const currentUserIdType = typeof currentUserId;
  
  // Try different comparison methods using AuthUtils
  const stringComparison = String(commentUserId) === String(currentUserId);
  const numberComparison = 
    numericCommentUserId !== null && 
    numericCurrentUserId !== null && 
    numericCommentUserId === numericCurrentUserId;
  const storedIdComparison = 
    storedUserId !== null && 
    numericCommentUserId !== null && 
    numericCommentUserId === storedUserId;
    
  // Check if AuthUtils would consider this comment authored by current user
  const authUtilsResult = AuthUtils.isCurrentUserCommentAuthor(comment);
  
  // Get user object from context if available
  const authUserInfo = window.authDebugInfo || null;
  
  return {
    // Raw IDs
    commentUserId,
    commentUserIdType,
    currentUserId, 
    currentUserIdType,
    
    // Numeric IDs (processed by AuthUtils)
    numericCommentUserId,
    numericCurrentUserId,
    storedUserId,
    
    // Comparison results
    stringComparison,
    numberComparison,
    storedIdComparison,
    
    // AuthUtils results
    authUtilsResult: AuthUtils.isCurrentUserCommentAuthor(comment),
    
    // Additional context
    authUserInfo,
    rawValues: comment // Include the raw comment for reference
  };
};

/**
 * Format the debug info for display
 * 
 * @param {Object} debugInfo - The debug info object from getCommentAuthorDebugInfo
 * @returns {string} - Formatted debug info as a string
 */
export const formatCommentAuthorDebugInfo = (debugInfo) => {
  const {
    commentUserId,
    commentUserIdType,
    currentUserId,
    currentUserIdType,
    numericCommentUserId,
    numericCurrentUserId,
    storedUserId,
    stringComparison,
    numberComparison,
    storedIdComparison,
    authUtilsResult,
    authUserInfo
  } = debugInfo;
  
  return `Comment User ID: ${commentUserId} (type: ${commentUserIdType})
Numeric Comment ID: ${numericCommentUserId}

Current User ID: ${currentUserId} (type: ${currentUserIdType})
Numeric Current ID: ${numericCurrentUserId}

Stored User ID: ${storedUserId || 'Not found'}

Comparison Results:
- String comparison: ${stringComparison ? 'MATCH' : 'NO MATCH'}
- Number comparison: ${numberComparison ? 'MATCH' : 'NO MATCH'}
- Stored User ID match: ${storedIdComparison ? 'MATCH' : 'NO MATCH'}
- AuthUtils method: ${authUtilsResult ? 'MATCH' : 'NO MATCH'}

Auth User Info:
${authUserInfo ? JSON.stringify(authUserInfo, null, 2) : 'Not available'}

Raw Values:
${JSON.stringify(debugInfo.rawValues, null, 2)}
`;
};
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import AuthUtils from '../../utils/AuthUtils';

/**
 * Enhanced debug component to help diagnose comment author issues
 * Only visible in development mode
 */
const CommentDebug = ({ comment, currentUserId }) => {
  const [expanded, setExpanded] = useState(false);
  const [debugData, setDebugData] = useState(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      // Get comment user ID
      const commentUserId = comment.user?.id || null;
      
      // Get stored user ID from localStorage using AuthUtils
      const storedUserId = AuthUtils.getStoredUserId();
      
      // Get auth info from window if available
      const authUserInfo = window.authDebugInfo || null;
      
      // Test different comparison methods using AuthUtils for consistent handling
      const numericCommentUserId = AuthUtils.ensureNumericId(commentUserId);
      const numericCurrentUserId = AuthUtils.ensureNumericId(currentUserId);
      
      // Compare using AuthUtils methods
      const stringComparison = String(commentUserId) === String(currentUserId);
      const numberComparison = 
        numericCommentUserId !== null && 
        numericCurrentUserId !== null && 
        numericCommentUserId === numericCurrentUserId;
      const storedIdMatch = 
        storedUserId !== null && 
        numericCommentUserId !== null && 
        numericCommentUserId === storedUserId;
      
      // Create debug data object with more detailed information
      const data = {
        commentUserId,
        commentUserIdType: typeof commentUserId,
        numericCommentUserId,
        
        currentUserId,
        currentUserIdType: typeof currentUserId,
        numericCurrentUserId,
        
        storedUserId,
        
        // Comparison methods
        stringComparison,
        numberComparison,
        storedIdMatch,
        
        // Show if AuthUtils would consider this comment authored by current user
        authUtilsMethod: AuthUtils.isCurrentUserCommentAuthor(comment),
        
        // Additional context
        authUserInfo,
        rawComment: comment
      };
      
      setDebugData(data);
      
      // Store in window for console access
      if (!window.commentDebugData) {
        window.commentDebugData = {};
      }
      window.commentDebugData[`comment_${comment.id}`] = data;
    }
  }, [comment, currentUserId]);

  if (!import.meta.env.DEV || !debugData) {
    return null;
  }

  return (
    <div className="mt-2 p-2 border border-yellow-400 bg-yellow-50 rounded text-xs">
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="flex items-center w-full justify-between font-medium text-yellow-800"
      >
        <span>Debug Info</span>
        <span>{expanded ? '▼' : '►'}</span>
      </button>
      
      {expanded && (
        <div className="mt-2 space-y-1">
          <p><strong>Comment User ID:</strong> {debugData.commentUserId} (type: {debugData.commentUserIdType})</p>
          <p><strong>Current User ID:</strong> {debugData.currentUserId} (type: {debugData.currentUserIdType})</p>
          
          <div className="mt-2">
            <p className="font-semibold">ID Values:</p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Comment User ID:</strong> {debugData.commentUserId} 
                (type: {debugData.commentUserIdType}) → 
                <span className="font-mono">Numeric: {debugData.numericCommentUserId}</span>
              </li>
              <li>
                <strong>Current User ID:</strong> {debugData.currentUserId} 
                (type: {debugData.currentUserIdType}) → 
                <span className="font-mono">Numeric: {debugData.numericCurrentUserId}</span>
              </li>
              <li>
                <strong>Stored User ID:</strong> {debugData.storedUserId || 'Not found'}
              </li>
            </ul>
          </div>

          <div className="mt-2">
            <p className="font-semibold">Comparison Results:</p>
            <ul className="list-disc pl-5">
              <li className={debugData.stringComparison ? 'text-green-600' : 'text-red-600'}>
                String comparison: {debugData.stringComparison ? 'MATCH' : 'NO MATCH'}
              </li>
              <li className={debugData.numberComparison ? 'text-green-600' : 'text-red-600'}>
                Number comparison: {debugData.numberComparison ? 'MATCH' : 'NO MATCH'}
              </li>
              <li className={debugData.storedIdMatch ? 'text-green-600' : 'text-red-600'}>
                Stored User ID match: {debugData.storedIdMatch ? 'MATCH' : 'NO MATCH'}
              </li>
              <li className={debugData.authUtilsMethod ? 'text-green-600 font-bold' : 'text-red-600'}>
                AuthUtils method: {debugData.authUtilsMethod ? 'MATCH' : 'NO MATCH'}
              </li>
            </ul>
          </div>

          {debugData.authUserInfo && (
            <div className="mt-2">
              <p className="font-semibold">Auth User Info:</p>
              <pre className="p-1 bg-gray-100 overflow-auto max-h-40 text-xs">
                {JSON.stringify(debugData.authUserInfo, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-2">
            <p className="font-semibold">Raw Values:</p>
            <pre className="p-1 bg-gray-100 overflow-auto max-h-40 text-xs">
              {JSON.stringify(debugData.rawComment, null, 2)}
            </pre>
          </div>
          
          <div className="mt-2 pt-2 border-t border-yellow-300">
            <p className="text-xs text-yellow-700">
              Debug data available in console via:
              <br />
              <code>window.commentDebugData.comment_{comment.id}</code>
            </p>
            <button
              onClick={() => console.log('Comment debug data:', debugData)}
              className="text-xs underline text-blue-600 hover:text-blue-800"
            >
              Log data to console
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

CommentDebug.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })
  }).isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default CommentDebug;
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CommentForm = ({ onSubmit }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const success = await onSubmit(commentText.trim());
      if (success) {
        setCommentText('');
      } else {
        setError('Failed to add comment. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Comment submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Leave a comment
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                    focus:outline-none focus:ring-primary focus:border-primary 
                    dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          placeholder="Share your thoughts..."
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark 
                     dark:bg-primary-dark dark:hover:bg-primary
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default CommentForm;
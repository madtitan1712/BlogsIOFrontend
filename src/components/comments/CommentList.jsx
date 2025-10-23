import PropTypes from 'prop-types';
import { useState } from 'react';
import Comment from './Comment';
import { TextArea, Button, FormGroup } from '../ui';

const CommentList = ({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  isAuthenticated,
  className = '',
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle new comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onAddComment(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit initialization
  const startEdit = (comment) => {
    setEditingComment(comment);
    setEditText(comment.commentText);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  // Save edited comment
  const saveEdit = async () => {
    if (!editText.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onEditComment(editingComment.id, editText);
      setEditingComment(null);
      setEditText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <h3 className="font-sans text-lg font-medium mb-4">
        Comments ({comments.length})
      </h3>
      
      {/* New comment form for authenticated users */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <TextArea
            id="newComment"
            label="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            required
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <p className="text-accent mb-6 font-sans">
          <a href="/login" className="text-text-primary underline">Sign in</a> to leave a comment.
        </p>
      )}
      
      {/* Comments list */}
      <div className="space-y-1">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id}>
              {editingComment && editingComment.id === comment.id ? (
                <FormGroup className="mb-4">
                  <TextArea
                    id={`edit-comment-${comment.id}`}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="Edit your comment..."
                    required
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={saveEdit} 
                      disabled={isSubmitting || !editText.trim()}
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </FormGroup>
              ) : (
                <>
                  <Comment
                    comment={comment}
                    onEdit={startEdit}
                    onDelete={onDeleteComment}
                  />
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-accent font-sans py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
};

CommentList.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      commentText: PropTypes.string.isRequired,
      timeCreated: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name: PropTypes.string
      }),
      postId: PropTypes.number
    })
  ).isRequired,

  onAddComment: PropTypes.func.isRequired,
  onEditComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default CommentList;
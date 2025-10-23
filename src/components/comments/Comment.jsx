import PropTypes from 'prop-types';
import AuthUtils from '../../utils/AuthUtils';

const Comment = ({ 
  comment,
  onEdit,
  onDelete,
  className = '',
}) => {
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Use AuthUtils to determine if current user is the comment author
  // This handles all the necessary ID conversions and comparisons
  const isAuthor = AuthUtils.isCurrentUserCommentAuthor(comment);  return (
    <div className={`border-b border-border-color py-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-text-primary">
            {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="font-sans font-medium ml-2">
            {comment.user?.name || 'Anonymous'}
          </span>
        </div>
        <time className="text-xs text-accent font-sans" dateTime={comment.timeCreated}>
          {formatDate(comment.timeCreated)}
        </time>
      </div>
      
      <p className="font-serif text-text-primary my-2 whitespace-pre-line">
        {comment.commentText}
      </p>
      {/* Debug component removed as requested */}
      
      {/* Always show buttons, but disable if not author */}
      {isAuthor && (
        <div className="flex gap-4 mt-3">
          <button 
            onClick={() => onEdit(comment)}
            className="text-sm font-sans transition-colors text-accent hover:text-text-primary"
            title="Edit comment"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(comment.id)}
            className="text-sm font-sans transition-colors text-red-500 hover:text-red-700"
            title="Delete comment"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    commentText: PropTypes.string.isRequired,
    timeCreated: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string
    }),
    postId: PropTypes.number
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  className: PropTypes.string,
};

export default Comment;
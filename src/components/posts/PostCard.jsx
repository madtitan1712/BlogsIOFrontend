import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PostCard = ({
  post,
  className = '',
}) => {
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <article className={`h-full flex flex-col ${className}`}>
      {post.imageUrl && (
        <div className="mb-4 overflow-hidden rounded-t-lg h-48">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <div className="flex-grow flex flex-col">
        <Link to={`/post/${post.id}`} className="block mb-2 group">
          <h2 className="font-sans text-xl font-semibold hover:text-accent transition-colors duration-200 group-hover:translate-x-1 transition-transform">
            {post.title}
          </h2>
        </Link>
        
        <div className="flex items-center text-xs mb-3 opacity-75">
          <span className="font-sans">{post.author?.name || 'Unknown'}</span>
          <span className="mx-2">•</span>
          <time className="font-serif" dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map(tag => (
              <span 
                key={tag} 
                className="bg-accent-light text-accent-dark dark:bg-accent-dark dark:text-accent-light text-xs px-2 py-1 rounded-full font-sans"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {post.content && (
          <div className="font-serif opacity-80 line-clamp-3 mb-4 leading-relaxed text-sm flex-grow">
            {/* Remove HTML tags for preview */}
            {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}
            {post.content.length > 150 && '...'}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-color">
          <Link 
            to={`/post/${post.id}`}
            className="btn-primary text-xs py-1 px-3 hover:translate-x-1 transition-transform inline-flex items-center group"
          >
            Read more
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          {post.status && (
            <span 
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                post.status === 'PUBLISHED' 
                  ? 'bg-success/20 text-success' 
                  : 'bg-warning/20 text-warning'
              }`}
            >
              {post.status}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    status: PropTypes.string,
    author: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  className: PropTypes.string,
};

export default PostCard;
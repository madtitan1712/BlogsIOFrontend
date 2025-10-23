import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * RecentItems component for displaying recent posts or comments
 */
const RecentItems = ({ title, items, type, hideHeader = false }) => {
  return (
    <div className={hideHeader ? "" : "bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"}>
      {!hideHeader && title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {type === 'posts' ? (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {items.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No {type} found.
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {type === 'posts' ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/post/${item.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.author?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white truncate max-w-xs">
                          {item.commentText}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.user?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/post/${item.postId}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          {item.postTitle || `Post #${item.postId}`}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.timeCreated)}
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid date';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Status badge component
const StatusBadge = ({ status }) => {
  let colorClass = '';
  
  switch (status?.toUpperCase()) {
    case 'PUBLISHED':
      colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      break;
    case 'DRAFT':
      colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status || 'Unknown'}
    </span>
  );
};

RecentItems.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['posts', 'comments']).isRequired,
  hideHeader: PropTypes.bool
};

StatusBadge.propTypes = {
  status: PropTypes.string
};

export default RecentItems;
import PropTypes from 'prop-types';

/**
 * DashboardStats component displays key statistics in the admin dashboard
 * Vertically stacked for left sidebar layout
 */
const DashboardStats = ({ stats, className = "" }) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <StatCard 
        title="Total Users" 
        value={stats.totalUsers} 
        icon={<UsersIcon className="w-6 h-6" />}
        color="blue"
      />
      <StatCard 
        title="Total Posts" 
        value={stats.totalPosts} 
        icon={<DocumentIcon className="w-6 h-6" />}
        color="green"
      />
      <StatCard 
        title="Total Comments" 
        value={stats.totalComments} 
        icon={<ChatIcon className="w-6 h-6" />}
        color="yellow"
      />
      <StatCard 
        title="Posts This Month" 
        value={stats.postsThisMonth} 
        icon={<ChartIcon className="w-6 h-6" />}
        color="purple"
      />
    </div>
  );
};

/**
 * StatCard component displays an individual statistic
 * Styled for sidebar display
 */
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  const borderClasses = {
    blue: 'border-l-4 border-blue-500',
    green: 'border-l-4 border-green-500',
    yellow: 'border-l-4 border-yellow-500',
    purple: 'border-l-4 border-purple-500',
    red: 'border-l-4 border-red-500'
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${borderClasses[color]}`}>
      <div className="flex items-center">
        <div className={`p-3 mr-4 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Simple icon components
const UsersIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChatIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

DashboardStats.propTypes = {
  stats: PropTypes.shape({
    totalUsers: PropTypes.number.isRequired,
    totalPosts: PropTypes.number.isRequired,
    totalComments: PropTypes.number.isRequired,
    postsThisMonth: PropTypes.number.isRequired
  }).isRequired,
  className: PropTypes.string
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'yellow', 'purple', 'red']).isRequired
};

UsersIcon.propTypes = {
  className: PropTypes.string
};

DocumentIcon.propTypes = {
  className: PropTypes.string
};

ChatIcon.propTypes = {
  className: PropTypes.string
};

ChartIcon.propTypes = {
  className: PropTypes.string
};

export default DashboardStats;
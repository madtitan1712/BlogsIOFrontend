import PropTypes from 'prop-types';

/**
 * RoleBadge component displays a user role with appropriate styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.role - The user role to display
 */
const RoleBadge = ({ role }) => {
  const normalizedRole = typeof role === 'string' ? role.toUpperCase() : 'READER';
  
  // Define styling for different roles
  const styles = {
    ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    AUTHOR: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    READER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  // Use READER styling as a fallback
  const badgeStyle = styles[normalizedRole] || styles.READER;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyle}`}>
      {normalizedRole}
    </span>
  );
};

RoleBadge.propTypes = {
  role: PropTypes.string.isRequired,
};

export default RoleBadge;
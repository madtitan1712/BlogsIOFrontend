import PropTypes from 'prop-types';

/**
 * TabNav component for dashboard navigation
 */
const TabNav = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <ul className="flex flex-wrap -mb-px">
        {tabs.map((tab) => (
          <li key={tab.id} className="mr-2">
            <button
              onClick={() => onTabChange(tab.id)}
              className={`inline-block py-4 px-4 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

TabNav.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default TabNav;
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from './index';

const SearchBar = ({
  onSearch,
  placeholder = 'Search...',
  className = '',
  initialValue = '',
  debounceMs = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
    
    // Clear any existing timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Set a new timeout for debouncing
    window.searchTimeout = setTimeout(() => {
      setIsSearching(false);
      if (onSearch) {
        onSearch(value);
      }
    }, debounceMs);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Input
        id="search"
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        className="pr-10"
        aria-label="Search"
      />
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        {isSearching ? (
          // Simple loading indicator
          <div className="animate-spin h-4 w-4 border-2 border-accent border-t-text-primary rounded-full" />
        ) : (
          // Search icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>
    </form>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  initialValue: PropTypes.string,
  debounceMs: PropTypes.number,
};

export default SearchBar;
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import PropTypes from 'prop-types';

const Header = ({ darkMode, toggleDarkMode }) => {
  const { logout, isAuthenticated, hasRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border-color py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to={isAuthenticated() ? "/home" : "/"} className="font-sans font-bold text-2xl text-text-primary">
          BlogsIO
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-accent/10"
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-text-primary" />
            ) : (
              <MoonIcon className="w-5 h-5 text-text-primary" />
            )}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center space-x-4">
            {isAuthenticated() && (
              <Link to="/home" className="font-sans text-text-primary hover:text-accent transition-colors">
                Home
              </Link>
            )}
            
            {isAuthenticated() ? (
              <>
                {(hasRole('AUTHOR') || hasRole('ADMIN')) && (
                  <Link to="/dashboard" className="font-sans text-text-primary hover:text-accent transition-colors">
                    Dashboard
                  </Link>
                )}
                {hasRole('ADMIN') && (
                  <Link to="/admin" className="font-sans text-text-primary hover:text-accent transition-colors">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="font-sans text-text-primary hover:text-accent transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-sans text-text-primary hover:text-accent transition-colors">
                  Login
                </Link>
                <Link to="/register" className="font-sans text-text-primary hover:text-accent transition-colors">
                  Register
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded-md hover:bg-accent/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <HamburgerIcon className="w-6 h-6 text-text-primary" />
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-background border-b border-border-color">
          <div className="px-4 py-3 space-y-3">
            {isAuthenticated() && (
              <Link 
                to="/home" 
                className="block font-sans text-text-primary hover:text-accent transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            )}
            
            {isAuthenticated() ? (
              <>
                {(hasRole('AUTHOR') || hasRole('ADMIN')) && (
                  <Link 
                    to="/dashboard" 
                    className="block font-sans text-text-primary hover:text-accent transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                {hasRole('ADMIN') && (
                  <Link 
                    to="/admin" 
                    className="block font-sans text-text-primary hover:text-accent transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left font-sans text-text-primary hover:text-accent transition-colors py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block font-sans text-text-primary hover:text-accent transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block font-sans text-text-primary hover:text-accent transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Simple icon components
const SunIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const HamburgerIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

SunIcon.propTypes = {
  className: PropTypes.string
};

MoonIcon.propTypes = {
  className: PropTypes.string
};

HamburgerIcon.propTypes = {
  className: PropTypes.string
};

Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired
};

export default Header;
import { createContext } from 'react';
import PropTypes from 'prop-types';

/**
 * Authentication context for managing user authentication state
 * @typedef {Object} AuthContextType
 * @property {Object|null} user - The current authenticated user or null if not logged in
 * @property {string|number|null} user.id - The user's ID (numeric if available, otherwise string)
 * @property {string} user.name - The user's name
 * @property {string} user.email - The user's email
 * @property {('ADMIN'|'AUTHOR'|'READER')} user.role - The user's role
 * @property {number|null} user.numericId - The user's numeric ID if available
 * @property {string|null} user.emailId - The user's email ID if available
 * @property {boolean} loading - Whether authentication is currently loading
 * @property {string|null} error - Any error message related to authentication
 * @property {function(string, string): Promise<boolean>} login - Function to log in a user
 * @property {function(string, string, string): Promise<boolean>} register - Function to register a new user
 * @property {function(): void} logout - Function to log out the current user
 * @property {function(): boolean} isAuthenticated - Function to check if a user is authenticated
 * @property {function(string): boolean} hasRole - Function to check if the user has a specific role
 */

/**
 * Default context value with documentation for IDE support
 * @type {AuthContextType}
 */
const defaultContextValue = {
  user: null,
  loading: false,
  error: null,
  login: () => Promise.resolve(false),
  register: () => Promise.resolve(false),
  logout: () => {},
  isAuthenticated: () => false,
  hasRole: () => false
};

export const AuthContext = createContext(defaultContextValue);

// Define prop types for the context value
export const AuthContextPropTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.oneOf(['ADMIN', 'AUTHOR', 'READER']),
    numericId: PropTypes.number,
    emailId: PropTypes.string
  }),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  login: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
  hasRole: PropTypes.func.isRequired
};
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';

/**
 * ProtectedRoute component
 * 
 * Protects routes that require authentication and specific roles
 * Redirects to login if not authenticated
 * Shows access denied if authenticated but lacking required role
 */
const ProtectedRoute = ({ 
  element, 
  requiredRoles = [],
  accessDeniedElement = null,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if role requirement exists and user has one of the required roles
  if (requiredRoles.length > 0) {
    // Make sure user.role is a string before using toUpperCase
    const userRole = typeof user?.role === 'string' ? user.role.toUpperCase() : null;
    
    // Check if user has any of the required roles (case-insensitive)
    const hasRequiredRole = userRole && requiredRoles.some(role => 
      userRole === role.toUpperCase()
    );
    
    if (!user || !hasRequiredRole) {
      // Show access denied element if provided, otherwise show default message
      return accessDeniedElement || (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="mb-4">You don't have permission to access this page.</p>
          <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg mb-4 text-xs text-left max-w-lg mx-auto">
            User role: {user?.role || 'undefined'}{'\n'}
            Required roles: {requiredRoles.join(', ')}
          </pre>
        </div>
      );
    }
  }

  // Render the protected component
  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
  accessDeniedElement: PropTypes.element,
};

export default ProtectedRoute;
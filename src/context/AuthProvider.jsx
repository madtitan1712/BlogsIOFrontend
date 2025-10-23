import { useState, useEffect } from 'react';
import { AuthContext, AuthContextPropTypes } from './AuthContext';
import AuthService from '../services/AuthService';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if we have a token on initial load
  useEffect(() => {
    const initialize = async () => {
      await initializeAuth();
    };
    initialize();
  }, []);

  // Initialize authentication state
  const initializeAuth = async () => {
    // Remove any existing role overrides from localStorage
    localStorage.removeItem('dev_override_role');
    
    const token = AuthService.getToken();
    if (token) {
      try {

        
        // First attempt to get profile data - most reliable source of user info
        let profileData = null;
        try {
          profileData = await AuthService.getUserProfile();

        } catch (profileErr) {
          console.error('Failed to fetch profile during init, will use JWT:', profileErr);
        }
        
        // Decode the JWT to get basic user info as backup
        const decoded = jwtDecode(token);
        
        // Extract user role - handle different JWT structures including the new comma-separated format
        let role = decoded.role || decoded.roles || decoded.authorities || 'READER';
        let roleValue;
        
        // Check if the role is a comma-separated string (from the new backend format)
        if (typeof role === 'string' && role.includes(',')) {
            // Split by comma and get the first role
            const roleArray = role.split(',');
            console.log('Parsed comma-separated roles:', roleArray);
            // Use the highest privilege role (ADMIN > AUTHOR > READER)
            if (roleArray.includes('ROLE_ADMIN')) {
                roleValue = 'ADMIN';
            } else if (roleArray.includes('ROLE_AUTHOR')) {
                roleValue = 'AUTHOR';
            } else {
                roleValue = 'READER';
            }
        } else {
            // Handle existing formats
            roleValue = Array.isArray(role) ? role[0] : role;
        }
        
        // Strip "ROLE_" prefix if present
        if (typeof roleValue === 'string' && roleValue.startsWith('ROLE_')) {
            roleValue = roleValue.substring(5); // Remove "ROLE_" prefix
        }
        
        // Always normalize role to uppercase for consistent comparison
        roleValue = typeof roleValue === 'string' ? roleValue.toUpperCase() : 'READER';
        
        // Using role directly from JWT without any overrides
        console.log('Using role directly from JWT token:', roleValue);
        
        // Extract and normalize user ID (always convert to string for consistent comparison)
        const userId = decoded.id || decoded.sub; // 'sub' is standard for subject (user id)
        
        // For emails as IDs, try to find a numeric ID in the token
        let numericId = decoded.id;
        let userEmail = decoded.email;
        
        // If sub is an email and no email is provided, use sub as email
        if (!userEmail && typeof userId === 'string' && userId.includes('@')) {
          userEmail = userId;
        }
        
        // User's name - try different possible fields in JWT
        const userName = decoded.name || decoded.username || decoded.given_name || 
                         (userEmail ? userEmail.split('@')[0] : 'User');
        
        // Log the user info for debugging in development
        if (import.meta.env.DEV) {
          console.log('User info from JWT:', {
            decoded,
            userId,
            numericId,
            userEmail,
            userName,
            role: roleValue
          });
        }
        
        // If we have a numeric ID, store it in localStorage for comment author comparison
        if (numericId) {
          localStorage.setItem('userId', String(numericId));
        }
        
        // Create user data object, prioritizing profile data if available
        let userData;
        
        if (profileData && profileData.id) {
          // If we have profile data, use it as the primary source of information
          userData = {
            // CRITICAL: Use the numeric ID from profile as primary ID
            id: Number(profileData.id),
            email: profileData.email || userEmail || String(userId),
            name: profileData.name || userName,
            role: roleValue, // Still use role from JWT as it might have permissions info
            // Store both ID types for reference and debugging
            numericId: Number(profileData.id),
            emailId: profileData.email || userEmail || (userId && typeof userId === 'string' && userId.includes('@') ? userId : null)
          };
          
          console.log('Created user data from profile:', userData);
          
          // Store numeric user ID in localStorage - ENSURE it's a number
          const numericUserId = Number(profileData.id);
          localStorage.setItem('userId', String(numericUserId));
          console.log('Stored numeric userId in localStorage:', numericUserId);
        } else {
          // Fallback to JWT data if profile is not available
          userData = {
            // If using JWT data, still try to use numeric ID when available
            id: numericId ? Number(numericId) : String(userId),
            email: userEmail || String(userId),
            name: userName,
            role: roleValue,
            // Store both ID types for reference and debugging
            numericId: numericId ? Number(numericId) : null,
            emailId: userEmail || (userId && typeof userId === 'string' && userId.includes('@') ? userId : null)
          };
          
          console.log('Created user data from JWT (no profile):', userData);
          
          // If we have a numeric ID from JWT, store it in localStorage
          if (numericId) {
            const numericUserId = Number(numericId);
            localStorage.setItem('userId', String(numericUserId));
            console.log('Stored numeric userId from JWT in localStorage:', numericUserId);
          }
        }
        
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error('Error decoding token:', err);
        AuthService.logout();
        setError('Invalid authentication token. Please log in again.');
      }
    }
    setLoading(false);
  };

  // Function to login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AuthService.login(email, password);
      
      if (response && response.jwt) {
        // Decode the token to get user info
        const decoded = jwtDecode(response.jwt);
        console.log('Decoded JWT token after login:', decoded);
        
        // Extract user role - handle different JWT structures including the new comma-separated format
        let role = decoded.role || decoded.roles || decoded.authorities || 'READER';
        let roleValue;
        
        // Check if the role is a comma-separated string (from the new backend format)
        if (typeof role === 'string' && role.includes(',')) {
            // Split by comma and get the first role
            const roleArray = role.split(',');
            console.log('Parsed comma-separated roles:', roleArray);
            // Use the highest privilege role (ADMIN > AUTHOR > READER)
            if (roleArray.includes('ROLE_ADMIN')) {
                roleValue = 'ADMIN';
            } else if (roleArray.includes('ROLE_AUTHOR')) {
                roleValue = 'AUTHOR';
            } else {
                roleValue = 'READER';
            }
        } else {
            // Handle existing formats
            roleValue = Array.isArray(role) ? role[0] : role;
        }
        
        // Strip "ROLE_" prefix if present
        if (typeof roleValue === 'string' && roleValue.startsWith('ROLE_')) {
            roleValue = roleValue.substring(5); // Remove "ROLE_" prefix
        }
        
        // Always normalize role to uppercase for consistent comparison
        roleValue = typeof roleValue === 'string' ? roleValue.toUpperCase() : 'READER';
        
        // Using role directly from JWT without any overrides
        console.log('Using role directly from JWT token:', roleValue);
        
        // Extract and normalize user ID (always convert to string for consistent comparison)
        const userId = decoded.id || decoded.sub; // 'sub' is standard for subject (user id)
        
        // For emails as IDs, try to find a numeric ID in the token
        let numericId = decoded.id;
        let userEmail = decoded.email;
        
        // If sub is an email and no email is provided, use sub as email
        if (!userEmail && typeof userId === 'string' && userId.includes('@')) {
          userEmail = userId;
        }
        
        // User's name - try different possible fields in JWT
        const userName = decoded.name || decoded.username || decoded.given_name || 
                         (userEmail ? userEmail.split('@')[0] : 'User');
        
        // Log the user info for debugging in development
        if (import.meta.env.DEV) {
          console.log('User info from login JWT:', {
            decoded,
            userId,
            numericId,
            userEmail,
            userName,
            role: roleValue
          });
        }
        
        // Create user data object, prioritizing profile data if available
        let userData;
        
        if (response.profile && response.profile.id) {
          // If we have profile data from login response, use it as primary source
          userData = {
            // CRITICAL: Use the numeric ID from profile as primary ID
            id: Number(response.profile.id),
            email: response.profile.email || userEmail || String(userId),
            name: response.profile.name || userName,
            role: roleValue, // Still use role from JWT as it might have permissions info
            // Store both ID types for reference and debugging
            numericId: Number(response.profile.id),
            emailId: response.profile.email || userEmail || (userId && typeof userId === 'string' && userId.includes('@') ? userId : null)
          };
          
          console.log('Created user data from login profile:', userData);
          
          // Store numeric user ID in localStorage - ENSURE it's a number
          const numericUserId = Number(response.profile.id);
          localStorage.setItem('userId', String(numericUserId));
          console.log('Stored numeric userId in localStorage from login:', numericUserId);
        } else {
          // Fallback to JWT data if profile is not available in login response
          userData = {
            // If using JWT data, still try to use numeric ID when available
            id: numericId ? Number(numericId) : String(userId),
            email: userEmail || String(userId),
            name: userName,
            role: roleValue,
            // Store both ID types for reference and debugging
            numericId: numericId ? Number(numericId) : null,
            emailId: userEmail || (userId && typeof userId === 'string' && userId.includes('@') ? userId : null)
          };
          
          console.log('Created user data from login JWT (no profile):', userData);
          
          // If we have a numeric ID from JWT, store it
          if (numericId) {
            const numericUserId = Number(numericId);
            localStorage.setItem('userId', String(numericUserId));
            console.log('Stored numeric userId from JWT in localStorage:', numericUserId);
          } else {
            // If no numeric ID found, try to fetch profile separately
            console.log('No numeric ID in JWT, attempting to fetch profile separately...');
            try {
              const profileData = await AuthService.getUserProfile();
              if (profileData && profileData.id) {
                const numericUserId = Number(profileData.id);
                localStorage.setItem('userId', String(numericUserId));
                
                // Update user data with profile info
                userData = {
                  ...userData,
                  id: numericUserId,
                  numericId: numericUserId,
                  name: profileData.name || userData.name,
                  email: profileData.email || userData.email,
                };
                
                console.log('Updated user data from separate profile fetch:', userData);
              }
            } catch (profileErr) {
              console.error('Failed to fetch profile after login:', profileErr);
              // Continue with JWT data
            }
          }
        }
        
        setUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to register
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      await AuthService.register(name, email, password);
      
      // Auto login after registration
      return await login(email, password);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to logout
  const logout = () => {
    AuthService.logout();
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    // Clear any other user-related data that might have been stored
    setUser(null);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
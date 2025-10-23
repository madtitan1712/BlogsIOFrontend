import api from './api';

// Service for authentication-related API calls
const AuthService = {
  // Register a new user
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        passwordHash: password,  // Note: The backend expects passwordHash but it's the plain password
        role: 'READER',  // Default role for new users
      });
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  // Log in an existing user
  login: async (email, password) => {
    try {
      // First, authenticate with email and password
      const response = await api.post('/auth/login', {
        username: email,  // The API expects username but it's actually email
        password,
      });
      
      // Store JWT token in localStorage
      if (response.data && response.data.jwt) {
        localStorage.setItem('jwt', response.data.jwt);
        
        try {
          // After successful login and setting JWT, fetch user profile
          // This call will use the JWT token from localStorage for authentication
          const profileData = await AuthService.getUserProfile();
          
          // If profile has a numeric ID, store it immediately
          if (profileData && profileData.id) {
            const numericUserId = Number(profileData.id);
            localStorage.setItem('userId', String(numericUserId));
          }
          
          // Return combined data with token and profile
          return {
            ...response.data,
            profile: profileData
          };
        } catch (profileError) {
          console.error('Error fetching profile after login:', profileError);
          // Continue even if profile fetch fails, the login was still successful
          return response.data;
        }
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  // Log out the current user
  logout: () => {
    localStorage.removeItem('jwt');
    // Additional logout logic if needed
  },

  // Check if the user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('jwt');
  },

  // Get current user's JWT
  getToken: () => {
    return localStorage.getItem('jwt');
  },

  // Get user profile data from the server
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      
      // Store the user ID in localStorage for easier access
      if (response.data && response.data.id) {
        // Always ensure we're storing a numeric ID by converting to number first
        const numericUserId = Number(response.data.id);
        localStorage.setItem('userId', String(numericUserId));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Get stored user ID (if available) - always return as number if possible
  getUserId: () => {
    const storedId = localStorage.getItem('userId');
    return storedId ? Number(storedId) : null;
  },

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', {
        email
      });
      return response.data;
    } catch (error) {
      console.error('Error during forgot password:', error);
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async ({ token, newPassword }) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error during password reset:', error);
      throw error;
    }
  }
};

export default AuthService;
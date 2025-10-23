import { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/layout/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { login, error: authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is already authenticated, redirect to the home page or intended destination
  if (isAuthenticated()) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic form validation
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Attempt to login using the AuthContext
      const success = await login(email, password);
      
      if (success) {
        // Redirect to the home page or the page they were trying to access
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setFormError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setFormError('An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md fade-in">
      <div className="modern-card shadow-large p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Log In</h1>
        
        {(formError || authError) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{formError || authError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/layout/Footer';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { register, error: authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to the home page
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Attempt to register using the AuthContext
      const success = await register(formData.name, formData.email, formData.password);
      
      if (success) {
        // Redirect to the home page
        navigate('/', { replace: true });
      } else {
        setFormError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setFormError('An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md fade-in">
      <div className="modern-card shadow-large p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
        
        {(formError || authError) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{formError || authError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 font-medium">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full"
              disabled={isSubmitting}
              error={fieldErrors.name}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full"
              disabled={isSubmitting}
              error={fieldErrors.email}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-2 font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full"
              disabled={isSubmitting}
              error={fieldErrors.password}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 font-medium">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full"
              disabled={isSubmitting}
              error={fieldErrors.confirmPassword}
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RegisterPage;
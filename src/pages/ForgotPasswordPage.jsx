import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ErrorAlert from '../components/ui/ErrorAlert';
import AuthService from '../services/AuthService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await AuthService.forgotPassword(email.trim());
      setIsSubmitted(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Check Your Email
            </h2>
            <p className="font-light text-lg text-text-secondary mb-8">
              If an account exists for <span className="font-medium text-accent">{email}</span>, 
              a password reset link has been sent to your email address.
            </p>
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-8">
              <p className="font-light text-sm text-text-secondary">
                <strong className="font-medium">Didn't receive the email?</strong>
                <br />
                Check your spam folder or wait a few minutes for the email to arrive.
                The reset link will expire in 15 minutes.
              </p>
            </div>
            <div className="space-y-4">
              <Link 
                to="/login" 
                className="w-full bg-accent text-white py-3 px-4 rounded-lg font-medium hover:bg-accent/90 transition-colors duration-200 block text-center"
              >
                Back to Login
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full text-accent border border-accent py-3 px-4 rounded-lg font-medium hover:bg-accent/5 transition-colors duration-200"
              >
                Try Different Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">
            Forgot Password?
          </h2>
          <p className="mt-4 font-light text-lg text-text-secondary">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <ErrorAlert message={error} />}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center">
              <Link 
                to="/login" 
                className="font-medium text-accent hover:text-accent/80 transition-colors duration-200"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </form>

        <div className="text-center">
          <p className="font-light text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-accent hover:text-accent/80 transition-colors duration-200"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import PasswordInput from '../components/ui/PasswordInput';
import ErrorAlert from '../components/ui/ErrorAlert';
import AuthService from '../services/AuthService';
import { STRENGTH_LEVELS } from '../utils/PasswordValidator';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setTokenError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [searchParams]);

  const handlePasswordValidation = (validation) => {
    setPasswordValidation(validation);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords using the new validation system
    if (!newPassword) {
      setError('Password is required');
      return;
    }

    if (passwordValidation && !passwordValidation.isValid) {
      setError('Password does not meet security requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.resetPassword({
        token: token,
        newPassword: newPassword
      });

      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to reset password. The token may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Password Reset Successful!
          </h2>
          <p className="font-light text-lg text-text-secondary mb-8">
            Your password has been successfully updated. You will be redirected to the login page in a few seconds.
          </p>
          <Link 
            to="/login" 
            className="w-full bg-accent text-white py-3 px-4 rounded-lg font-medium hover:bg-accent/90 transition-colors duration-200 block text-center"
          >
            Go to Login Now
          </Link>
        </div>
      </div>
    );
  }

  // Token error state
  if (tokenError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Invalid Reset Link
          </h2>
          <p className="font-light text-lg text-text-secondary mb-8">
            {tokenError}
          </p>
          <div className="space-y-4">
            <Link 
              to="/forgot-password" 
              className="w-full bg-accent text-white py-3 px-4 rounded-lg font-medium hover:bg-accent/90 transition-colors duration-200 block text-center"
            >
              Request New Reset Link
            </Link>
            <Link 
              to="/login" 
              className="w-full text-accent border border-accent py-3 px-4 rounded-lg font-medium hover:bg-accent/5 transition-colors duration-200 block text-center"
            >
              Back to Login
            </Link>
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
            Reset Your Password
          </h2>
          <p className="mt-4 font-light text-lg text-text-secondary">
            Enter your new password below to complete the reset process.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <ErrorAlert message={error} />}
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-text-primary mb-2">
              New Password
            </label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              onValidation={handlePasswordValidation}
              placeholder="Enter your new secure password"
              disabled={isLoading}
              showStrengthMeter={true}
              showCriteria={true}
              minStrengthLevel={STRENGTH_LEVELS.FAIR}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
              Confirm New Password
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your new password"
              disabled={isLoading}
              showStrengthMeter={false}
              showCriteria={false}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
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
            Remember your password?{' '}
            <Link 
              to="/login" 
              className="font-medium text-accent hover:text-accent/80 transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
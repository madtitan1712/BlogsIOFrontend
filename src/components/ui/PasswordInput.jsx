import React, { useState, useEffect, useRef } from 'react';
import { validatePassword } from '../../utils/PasswordValidator';

// Simple SVG icons
const EyeIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SmallCheckIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SmallXIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  onValidation,
  placeholder = 'Enter password',
  className = '',
  disabled = false,
  autoComplete = 'new-password',
  showStrengthMeter = true,
  showCriteria = true,
  minStrengthLevel = null, // Minimum strength level required
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const onValidationRef = useRef(onValidation);

  // Keep ref updated
  onValidationRef.current = onValidation;

  // Validate password whenever value changes
  useEffect(() => {
    const result = validatePassword(value || '');
    setValidation(result);
    
    // Call parent validation callback if provided
    if (onValidationRef.current) {
      onValidationRef.current(result);
    }
  }, [value]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const getStrengthBarColor = () => {
    if (!validation) return '#e5e7eb'; // gray-200
    return validation.strength.color;
  };

  const getStrengthBarWidth = () => {
    if (!validation) return 0;
    return validation.strength.percentage;
  };

  const shouldShowDetails = isFocused || (value && value.length > 0);

  return (
    <div className="password-input-container">
      {/* Password Input Field */}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value || ''}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`
            password-input-field
            ${validation && !validation.isValid && value ? 'error' : ''}
            ${className}
          `}
          {...props}
        />
        
        {/* Toggle Password Visibility Button */}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="password-toggle-btn"
          tabIndex={-1}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {/* Password Strength Meter */}
      {showStrengthMeter && shouldShowDetails && (
        <div className="password-strength-meter">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Password Strength
            </span>
            <span 
              className="text-sm font-medium"
              style={{ color: getStrengthBarColor() }}
            >
              {validation?.strength.label || 'Very Weak'}
            </span>
          </div>
          
          {/* Strength Progress Bar */}
          <div className="password-strength-bar">
            <div
              className="password-strength-fill"
              style={{
                width: `${getStrengthBarWidth()}%`,
                backgroundColor: getStrengthBarColor(),
              }}
            />
          </div>
        </div>
      )}

      {/* Password Criteria Checklist */}
      {showCriteria && shouldShowDetails && validation && (
        <div className="password-criteria-list">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Password Requirements
          </h4>
          <div className="space-y-1">
            {/* Required Criteria */}
            {Object.entries(validation.criteria).map(([key, criterion]) => (
              criterion.required && (
                <div
                  key={key}
                  className={`
                    flex items-center text-sm transition-colors duration-200
                    ${criterion.met ? 'text-green-600' : 'text-gray-500'}
                  `}
                >
                  <div className="mr-2 flex-shrink-0">
                    {criterion.met ? (
                      <CheckIcon />
                    ) : (
                      <XIcon />
                    )}
                  </div>
                  <span className={criterion.met ? 'line-through opacity-75' : ''}>
                    {criterion.label}
                  </span>
                </div>
              )
            ))}
            
            {/* Optional/Advanced Criteria - Now inside the same box */}
            {Object.entries(validation.criteria).map(([key, criterion]) => (
              !criterion.required && (
                <div
                  key={key}
                  className={`
                    flex items-center text-xs transition-colors duration-200
                    ${criterion.met ? 'text-green-600' : 'text-gray-400'}
                  `}
                >
                  <div className="mr-2 flex-shrink-0">
                    {criterion.met ? (
                      <SmallCheckIcon />
                    ) : (
                      <SmallXIcon />
                    )}
                  </div>
                  <span className={criterion.met ? 'line-through opacity-75' : ''}>
                    {criterion.label}
                  </span>
                </div>
              )
            ))}
          </div>
        </div>
      )}



      {/* Minimum Strength Warning */}
      {minStrengthLevel && validation && validation.strength.level < minStrengthLevel && value && (
        <div className="password-strength-warning">
          <strong>Note:</strong> A stronger password is recommended for better security.
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
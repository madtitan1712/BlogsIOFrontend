import PropTypes from 'prop-types';

const Input = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  className = '',
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block font-sans text-text-primary mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full px-3 py-2 bg-background 
          border border-border-color 
          rounded-md 
          font-sans
          text-text-primary
          placeholder-accent
          focus:outline-none focus:ring-2 focus:ring-accent/50
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-colors
          ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
        `}
        {...props}
      />
      {error && (
        <p 
          id={`${id}-error`}
          className="text-red-500 text-sm mt-1 font-sans"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Input;
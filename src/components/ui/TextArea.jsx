import PropTypes from 'prop-types';

const TextArea = ({
  id,
  label,
  placeholder = '',
  value,
  onChange,
  rows = 4,
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
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
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
          resize-y
          ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1 font-sans">{error}</p>
      )}
    </div>
  );
};

TextArea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  rows: PropTypes.number,
  error: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default TextArea;
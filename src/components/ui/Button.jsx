import PropTypes from 'prop-types';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  fullWidth = false,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'font-sans rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-text-primary text-background hover:opacity-90 focus:ring-accent/50',
    secondary: 'bg-transparent border border-text-primary text-text-primary hover:bg-text-primary/5 focus:ring-text-primary/30',
    ghost: 'bg-transparent text-text-primary hover:bg-text-primary/5 focus:ring-text-primary/30',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50'
  };
  
  // Size-specific classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-5 text-lg'
  };
  
  // Disabled state
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Full width
  const widthClasses = fullWidth ? 'w-full' : '';

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${disabledClasses}
    ${widthClasses}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
};

export default Button;
import PropTypes from 'prop-types';

const FormGroup = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`space-y-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default FormGroup;
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Confirmation Dialog component for destructive actions
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is visible
 * @param {function} props.onClose - Function to call when dialog is closed
 * @param {function} props.onConfirm - Function to call when action is confirmed
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} props.confirmText - Text for confirm button
 * @param {string} props.cancelText - Text for cancel button
 * @param {boolean} props.isLoading - Whether the confirm action is loading
 */
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 z-10 shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>
          <div className="flex justify-end space-x-3">
            <Button 
              variant="secondary" 
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button 
              variant="primary" 
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isLoading: PropTypes.bool
};

export default ConfirmDialog;
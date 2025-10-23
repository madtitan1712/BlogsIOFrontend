import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Write something amazing...',
  className = '',
  error = '',
  label = '',
  required = false,
}) => {
  const quillRef = useRef(null);

  // Focus the editor when it mounts and handle content update
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      // Add a slight delay to ensure the editor is fully initialized
      setTimeout(() => {
        // Only focus if we're creating a new post (no initial value)
        if (!value) {
          editor.focus();
        }
      }, 100);
    }
  }, [value]);

  // Quill modules and formats configuration - simplified for reliability
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }], // Header options
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link'],
        ['clean']
      ]
    },
    clipboard: {
      // Enable proper pasting from external sources
      matchVisual: false
    }
  };
  
  // Simple focus on mount
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      // Add a slight delay to ensure the editor is fully initialized
      setTimeout(() => {
        // Only focus if we're creating a new post (no initial value)
        if (!value) {
          editor.focus();
        }
      }, 100);
    }
  }, [value]);

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link'
  ];

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block font-sans text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={`
        editor-container rounded-lg overflow-hidden shadow-md
        ${error ? 'border border-red-500' : 'border border-gray-300'}
      `}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          className="basic-editor"
        />
      </div>
      
      <div className="flex justify-between items-center mt-2 text-xs font-sans">
        <div className="text-gray-600 dark:text-gray-400">
          {value && (
            <>
              <span>{value.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(word => word !== '').length} words</span>
              <span className="mx-2">•</span>
              <span>{value.replace(/<[^>]*>/g, '').length} characters</span>
            </>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-sm font-sans">
            {error}
          </p>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
        <span>
          💡 Tip: Use the toolbar above to format your text
        </span>
      </div>
    </div>
  );
};

RichTextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
};

export default RichTextEditor;
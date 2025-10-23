import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Auth Debugger Component
 * Only visible in development mode to debug authentication issues
 */
const AuthDebugger = () => {
  const authInfo = useAuth();
  const { user, isAuthenticated } = authInfo;
  const [isOpen, setIsOpen] = useState(false);

  // Save auth info to window for other components to access
  useEffect(() => {
    if (import.meta.env.DEV && window) {
      window.authDebugInfo = authInfo;
    }
  }, [authInfo]);

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-1 rounded-md text-xs"
      >
        {isOpen ? 'Hide' : 'Auth Debug'}
      </button>
      
      {isOpen && (
        <div className="bg-gray-800 text-white p-4 rounded-md mt-2 text-xs max-w-md overflow-auto max-h-80">
          <h3 className="font-bold mb-2">Auth Debug Info</h3>
          <div>
            <p><strong>Authenticated:</strong> {isAuthenticated() ? 'Yes' : 'No'}</p>
            <p><strong>User ID:</strong> {user?.id || 'Not logged in'} ({typeof user?.id})</p>
            <p><strong>User Name:</strong> {user?.name || 'N/A'}</p>
            <p><strong>User Email:</strong> {user?.email || 'N/A'}</p>
            <p><strong>User Role:</strong> {user?.role || 'N/A'}</p>
            <p><strong>Stored User ID:</strong> {localStorage.getItem('userId') || 'Not stored'}</p>
            
            <div className="mt-4">
              <p><strong>Full User Object:</strong></p>
              <pre className="w-full h-32 p-1 bg-gray-700 text-white text-xs mt-1 rounded-md overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            
            <div className="mt-4">
              <p><strong>JWT Token:</strong></p>
              <textarea
                readOnly
                className="w-full h-20 p-1 bg-gray-700 text-white text-xs mt-1 rounded-md"
                value={localStorage.getItem('jwt') || 'No token found'}
              ></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebugger;
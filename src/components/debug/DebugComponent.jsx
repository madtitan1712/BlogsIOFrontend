import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const DebugComponent = () => {
  const auth = useAuth();
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-8">
      <h2 className="text-xl font-bold mb-4">Authentication Debug</h2>
      <div className="mb-2">
        <strong>User authenticated:</strong> {auth.isAuthenticated() ? 'Yes' : 'No'}
      </div>
      <div className="mb-2">
        <strong>User role:</strong> {auth.user ? auth.user.role : 'Not logged in'}
      </div>
      <div className="mb-2">
        <strong>User name:</strong> {auth.user ? auth.user.name : 'Not logged in'}
      </div>
    </div>
  );
};

export default DebugComponent;
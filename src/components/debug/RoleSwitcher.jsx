import React from 'react';
import AuthService from '../../services/AuthService';
import { Button } from '../ui';

const RoleSwitcher = () => {
  const handleRoleChange = (newRole) => {
    // Always use uppercase for consistent role handling
    AuthService.changeRole(newRole.toUpperCase());
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 border border-blue-200 dark:border-blue-800">
      <h3 className="font-medium mb-2 text-blue-700 dark:text-blue-300">Development Role Switcher</h3>
      <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
        Change your role for testing purposes:
      </p>
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={() => handleRoleChange('READER')}
          className="text-xs py-1 px-3 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
        >
          Switch to READER
        </Button>
        <Button 
          onClick={() => handleRoleChange('AUTHOR')}
          className="text-xs py-1 px-3 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
        >
          Switch to AUTHOR
        </Button>
        <Button 
          onClick={() => handleRoleChange('ADMIN')}
          className="text-xs py-1 px-3 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300"
        >
          Switch to ADMIN
        </Button>
        <Button 
          onClick={() => localStorage.removeItem('dev_override_role') || window.location.reload()}
          className="text-xs py-1 px-3 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
        >
          Clear Override
        </Button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Note: This is for development purposes only. Page will refresh after role change.
      </p>
    </div>
  );
};

export default RoleSwitcher;
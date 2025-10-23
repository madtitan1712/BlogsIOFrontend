import React, { useState, useEffect } from 'react';

const StorageDebugger = () => {
  const [storageItems, setStorageItems] = useState({});
  
  useEffect(() => {
    // Get all localStorage items
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      items[key] = localStorage.getItem(key);
    }
    setStorageItems(items);
  }, []);

  const clearOverride = () => {
    localStorage.removeItem('dev_override_role');
    window.location.reload();
  };
  
  return (
    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 border border-red-200 dark:border-red-800">
      <h3 className="font-medium mb-2 text-red-700 dark:text-red-300">Storage Debugger</h3>
      
      <div>
        <h4 className="text-sm font-bold mb-2">localStorage Items:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto max-h-48">
          {JSON.stringify(storageItems, null, 2)}
        </pre>
      </div>
      
      {storageItems.dev_override_role && (
        <div className="mt-4">
          <p className="text-sm text-red-600 dark:text-red-400 font-bold">
            Role Override Detected: {storageItems.dev_override_role}
          </p>
          <button 
            onClick={clearOverride}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-300 px-3 py-1 text-xs rounded"
          >
            Clear Role Override
          </button>
        </div>
      )}
    </div>
  );
};

export default StorageDebugger;
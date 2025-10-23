import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminService from '../services/AdminService';
import { Button, Pagination, Spinner, ConfirmDialog, RoleBadge } from '../components/ui';
import ErrorAlert from '../components/ui/ErrorAlert';
import DashboardStats from '../components/admin/DashboardStats';
//import TabNav from '../components/admin/TabNav';
import RecentItems from '../components/admin/RecentItems';
import PropTypes from 'prop-types';
import { UsersIcon, DocumentsIcon, CommentsIcon } from '../components/admin/icons';
import '../components/animations.css';

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    postsThisMonth: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    sort: 'name,asc'
  });

  // State for confirmations
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    userId: null,
    userName: '',
    isLoading: false
  });

  const [roleConfirmation, setRoleConfirmation] = useState({
    isOpen: false,
    userId: null,
    userName: '',
    currentRole: '',
    newRole: '',
    isLoading: false
  });

  // Load data on initial render
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.size, pagination.sort]);

  useEffect(() => {
    loadDashboardStats();
    loadRecentPosts();
    loadRecentComments();
  }, []);

  // API functions
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { page, size, sort } = pagination;
      const data = await AdminService.getUsers({ page, size, sort });
      
      setUsers(data.content || []);
      setPagination(prev => ({
        ...prev,
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0
      }));
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadDashboardStats = async () => {
    try {
      const dashboardStats = await AdminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };
  
  const loadRecentPosts = async () => {
    try {
      const posts = await AdminService.getRecentPosts();
      setRecentPosts(posts);
    } catch (err) {
      console.error('Failed to fetch recent posts:', err);
    }
  };
  
  const loadRecentComments = async () => {
    try {
      const comments = await AdminService.getRecentComments({
        page: 0,
        size: 5,
        sort: 'timeCreated,desc'
      });
      setRecentComments(comments);
    } catch (err) {
      console.error('Failed to fetch recent comments:', err);
    }
  };

  // Handlers
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Delete user functions
  const openDeleteConfirmation = (userId, userName) => {
    setDeleteConfirmation({
      isOpen: true,
      userId,
      userName,
      isLoading: false
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      userId: null,
      userName: '',
      isLoading: false
    });
  };

  const handleDeleteUser = async () => {
    const { userId } = deleteConfirmation;
    
    try {
      setDeleteConfirmation(prev => ({ ...prev, isLoading: true }));
      await AdminService.deleteUser(userId);
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      closeDeleteConfirmation();
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user. Please try again.');
      setDeleteConfirmation(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Role change functions
  const openRoleConfirmation = (userId, userName, currentRole, newRole) => {
    setRoleConfirmation({
      isOpen: true,
      userId,
      userName,
      currentRole,
      newRole,
      isLoading: false
    });
  };

  const closeRoleConfirmation = () => {
    setRoleConfirmation({
      isOpen: false,
      userId: null,
      userName: '',
      currentRole: '',
      newRole: '',
      isLoading: false
    });
  };

  const handleRoleChange = async () => {
    const { userId, newRole } = roleConfirmation;
    
    try {
      setRoleConfirmation(prev => ({ ...prev, isLoading: true }));
      const updatedUser = await AdminService.updateUserRole(userId, newRole);
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: updatedUser.role || newRole } : user
      ));
      closeRoleConfirmation();
    } catch (err) {
      console.error('Failed to update user role:', err);
      setError('Failed to update user role. Please try again.');
      setRoleConfirmation(prev => ({ ...prev, isLoading: false }));
    }
  };

  const renderRoleButton = (userId, userName, currentRole, newRole, label) => {
    if (currentRole?.toUpperCase() === newRole) {
      return null;
    }

    if (user?.id === userId) {
      return null;
    }

    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => openRoleConfirmation(userId, userName, currentRole, newRole)}
        className="mr-1 text-xs"
      >
        {label}
      </Button>
    );
  };

  // Sorting
  const handleSort = (field) => {
    const currentSort = pagination.sort;
    const [currentField, currentDirection] = currentSort.split(',');
    
    let newSort;
    if (currentField === field) {
      newSort = `${field},${currentDirection === 'asc' ? 'desc' : 'asc'}`;
    } else {
      newSort = `${field},asc`;
    }
    
    setPagination(prev => ({ ...prev, sort: newSort }));
  };

  const getSortIndicator = (field) => {
    const [currentField, currentDirection] = pagination.sort.split(',');
    if (currentField !== field) return null;
    
    return currentDirection === 'asc' 
      ? <span className="ml-1">↑</span> 
      : <span className="ml-1">↓</span>;
  };

  // Tabs
  const tabs = [
    { id: 'users', label: 'Users', icon: <UsersIcon className="w-4 h-4 inline" /> },
    { id: 'posts', label: 'Recent Posts', icon: <DocumentsIcon className="w-4 h-4 inline" /> },
    { id: 'comments', label: 'Recent Comments', icon: <CommentsIcon className="w-4 h-4 inline" /> }
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900">
      {/* Main Content Area */}
      <main className="pt-6">
        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <ErrorAlert 
              message={error}
              onClose={() => setError(null)} 
            />
          </div>
        )}
        
        {/* Stats Section - Compact Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 mt-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center hover-lift animate-slide-in-up animation-delay-100">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 mr-3">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Users</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center hover-lift animate-slide-in-up animation-delay-200">
            <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300 mr-3">
              <DocumentsIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Posts</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalPosts}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center hover-lift animate-slide-in-up animation-delay-300">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300 mr-3">
              <CommentsIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Comments</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalComments}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center hover-lift animate-slide-in-up animation-delay-400">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">New Posts</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.postsThisMonth}</p>
            </div>
          </div>
        </div>
          
          {/* Tab Navigation - Centered Capsule */}
          <div className="flex justify-center mb-6 animate-fade-in animation-delay-200">
            <div className="bg-white dark:bg-gray-800 rounded-full shadow-sm inline-flex p-1.5 animate-scale-in">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium flex items-center transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white dark:bg-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <span className="mr-2 transition-transform">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Content Area */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-fade-in animation-delay-300">
            
            {/* Tab Content */}
            <div className="p-6 animate-scale-in animation-delay-400">
              {activeTab === 'users' && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">User Management</h2>
                  </div>
                  
                  <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg animate-slide-in-up animation-delay-100">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th 
                            onClick={() => handleSort('id')}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                          >
                            ID {getSortIndicator('id')}
                          </th>
                          <th 
                            onClick={() => handleSort('name')}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                          >
                            Name {getSortIndicator('name')}
                          </th>
                          <th 
                            onClick={() => handleSort('email')}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                          >
                            Email {getSortIndicator('email')}
                          </th>
                          <th 
                            onClick={() => handleSort('role')}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                          >
                            Role {getSortIndicator('role')}
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 text-center">
                              <Spinner size="md" />
                            </td>
                          </tr>
                        ) : users.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                              No users found.
                            </td>
                          </tr>
                        ) : (
                          users.map(userItem => (
                            <tr key={userItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {userItem.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {userItem.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {userItem.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <RoleBadge role={userItem.role} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <div className="flex justify-end space-x-2">
                                  {renderRoleButton(userItem.id, userItem.name, userItem.role, 'ADMIN', 'Make Admin')}
                                  {renderRoleButton(userItem.id, userItem.name, userItem.role, 'AUTHOR', 'Make Author')}
                                  {renderRoleButton(userItem.id, userItem.name, userItem.role, 'READER', 'Make Reader')}
                                  
                                  {userItem.id !== user?.id && (
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => openDeleteConfirmation(userItem.id, userItem.name)}
                                      className="text-xs"
                                    >
                                      Delete
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {!loading && pagination.totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                      <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'posts' && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Posts</h2>
                  </div>
                  
                  <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg animate-slide-in-up animation-delay-100">
                    <RecentItems 
                      title={null}
                      hideHeader={true}
                      items={recentPosts} 
                      type="posts"
                    />
                  </div>
                </div>
              )}
              
              {activeTab === 'comments' && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Comments</h2>
                  </div>
                  
                  <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg animate-slide-in-up animation-delay-100">
                    <RecentItems 
                      title={null}
                      hideHeader={true}
                      items={recentComments} 
                      type="comments"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      
      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteConfirmation.userName}? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        isLoading={deleteConfirmation.isLoading}
      />

      <ConfirmDialog
        isOpen={roleConfirmation.isOpen}
        onClose={closeRoleConfirmation}
        onConfirm={handleRoleChange}
        title="Change User Role"
        message={`Are you sure you want to change ${roleConfirmation.userName}'s role from ${roleConfirmation.currentRole} to ${roleConfirmation.newRole}?`}
        confirmText="Change Role"
        cancelText="Cancel"
        isLoading={roleConfirmation.isLoading}
      />
    </div>
  );
};

export default AdminPage;
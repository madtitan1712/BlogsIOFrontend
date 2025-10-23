import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthProvider';
import AuthDebugger from './components/debug/AuthDebugger';

// Base layout components
import Header from './components/layout/Header';
import ErrorBoundary from './components/layout/ErrorBoundary';
import ProtectedRoute from './components/routing/ProtectedRoute';
import './App.css';

// Import implemented pages
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PostDetailPage from './pages/PostDetailPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';

// Import the AdminPage
import AdminPage from './pages/AdminPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // On component mount, check if the user prefers dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          {/* Skip to main content link for screen readers */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
          >
            Skip to main content
          </a>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <ErrorBoundary>
            {/* Dev mode auth debugger */}
            {import.meta.env.DEV && <AuthDebugger />}
            <main id="main-content">
              <Routes>
              {/* Admin route with full width */}
              <Route path="/admin" element={
                <ProtectedRoute 
                  element={<AdminPage />} 
                  requiredRoles={['ADMIN']}
                />
              } />
              
              {/* Landing page with full width */}
              <Route path="/" element={<LandingPage />} />
              
              {/* All other routes with standard container */}
              <Route path="/home" element={
                <div className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
                  <HomePage />
                </div>
              } />
              <Route path="/login" element={
                <div className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
                  <LoginPage />
                </div>
              } />
              <Route path="/register" element={
                <div className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
                  <RegisterPage />
                </div>
              } />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/post/:id" element={
                <div className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
                  <PostDetailPage />
                </div>
              } />
              <Route path="/dashboard" element={
                <div className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
                  <ProtectedRoute 
                    element={<DashboardPage />} 
                    requiredRoles={['AUTHOR', 'ADMIN']}
                  />
                </div>
              } />
              <Route path="/editor" element={
                <div className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
                  <ProtectedRoute 
                    element={<EditorPage />} 
                    requiredRoles={['AUTHOR', 'ADMIN']}
                  />
                </div>
              } />
              <Route path="/editor/:id" element={
                <div className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
                  <ProtectedRoute 
                    element={<EditorPage />} 
                    requiredRoles={['AUTHOR', 'ADMIN']}
                  />
                </div>
              } />
              </Routes>
            </main>
          </ErrorBoundary>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

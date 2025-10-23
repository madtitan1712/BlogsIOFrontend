import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border-color mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-start gap-8 flex-wrap">
          {/* Brand Section */}
          <div className="flex-1 min-w-48">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center mr-2">
                <span className="text-white font-semibold text-xs">B</span>
              </div>
              <span className="font-sans font-bold text-lg text-text-primary">BlogsIO</span>
            </div>
            <p className="font-sans text-text-secondary text-sm leading-relaxed mb-3 max-w-xs">
              A simple platform for sharing your thoughts and stories.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent transition-colors duration-200"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8 flex-wrap">
            {/* Quick Links */}
            <div className="min-w-24">
              <h3 className="font-sans font-semibold text-text-primary mb-3 text-sm">Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="font-sans text-text-secondary hover:text-accent transition-colors duration-200 text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="font-sans text-text-secondary hover:text-accent transition-colors duration-200 text-sm"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="font-sans text-text-secondary hover:text-accent transition-colors duration-200 text-sm"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="font-sans text-text-secondary hover:text-accent transition-colors duration-200 text-sm"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="min-w-24">
              <h3 className="font-sans font-semibold text-text-primary mb-3 text-sm">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:support@blogsio.dev"
                    className="font-sans text-text-secondary hover:text-accent transition-colors duration-200 text-sm"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <span className="font-sans text-text-secondary text-sm">Documentation</span>
                </li>
                <li>
                  <span className="font-sans text-text-secondary text-sm">Help Center</span>
                </li>
                <li>
                  <span className="font-sans text-text-secondary text-sm">Privacy Policy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border-color mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-sans text-text-secondary text-sm mb-3 md:mb-0">
              © 2025 BlogsIO. All rights reserved. Built for writers.
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="font-sans text-text-secondary">Made with React & Vite</span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-sans text-text-secondary">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
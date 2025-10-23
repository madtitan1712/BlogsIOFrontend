import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-sans">Something went wrong</h2>
          <p className="text-accent mb-6 font-serif">
            We encountered an error while rendering this component.
          </p>
          {this.state.error && (
            <pre className="bg-border-color/20 p-4 rounded-lg overflow-auto max-w-full mb-6 text-sm">
              {this.state.error.toString()}
            </pre>
          )}
          <button
            className="bg-text-primary text-background px-4 py-2 rounded-md hover:opacity-90 transition-opacity font-sans"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let message = 'Something went wrong. Please try again later.';
      
      try {
        if (this.state.error?.message) {
          const firestoreError = JSON.parse(this.state.error.message);
          if (firestoreError.error?.includes('Missing or insufficient permissions')) {
            message = 'You do not have permission to perform this action. Please ensure you are logged in with the correct account.';
          }
        }
      } catch {
        // Not a JSON error, use default
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Application Error</h2>
              <p className="text-slate-500">{message}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-sm sm:max-w-md">
            <CardHeader className="text-center">
              <div className="bg-destructive/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:mb-4 sm:h-12 sm:w-12">
                <AlertTriangle className="text-destructive h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Something went wrong</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                An unexpected error occurred. Please try refreshing the page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {this.state.error && (
                <details className="text-xs sm:text-sm">
                  <summary className="text-muted-foreground cursor-pointer">
                    Error details (development only)
                  </summary>
                  <pre className="bg-muted mt-2 overflow-auto rounded p-2 text-xs">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={this.resetError} className="flex-1 text-sm sm:text-base">
                  <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex-1 text-sm sm:text-base"
                >
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

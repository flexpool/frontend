import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './Page.scss';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: any; errorInfo: any }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <CSSTransition in={true} timeout={0} appear unmountOnExit>
        <main className="page-transition">{children}</main>
      </CSSTransition>
    </ErrorBoundary>
  );
};

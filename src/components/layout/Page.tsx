import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { clx } from 'src/utils/clx';
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
    this.setState((state) => ({
      ...state,
      errorInfo,
      error,
    }));
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Something went wrong.</h1>
          {JSON.stringify(this.state.error)}
          {JSON.stringify(this.state.errorInfo)}
        </div>
      );
    }

    return this.props.children;
  }
}

export const Page: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <ErrorBoundary>
      <CSSTransition in={true} timeout={0} appear unmountOnExit>
        <main className={clx('page-transition', className)}>{children}</main>
      </CSSTransition>
    </ErrorBoundary>
  );
};

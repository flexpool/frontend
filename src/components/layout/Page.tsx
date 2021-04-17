import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { clx } from 'src/utils/clx';
import './Page.scss';

import styled from 'styled-components/macro';
import { LoaderSpinner } from '../Loader/LoaderSpinner';

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  margin: auto;
  min-height: 70vh;
`;

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
    console.error('Error', this.state.error);
    console.error('Error Info', this.state.errorInfo);
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
        <ErrorContainer>
          <h1>Something went wrong.</h1>
          <p>Apologies for the inconvenience! Please try again later. </p>
        </ErrorContainer>
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

export const PageLoading = styled(Page)`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`;

export const PageLoader = () => (
  <PageLoading>
    <LoaderSpinner />
  </PageLoading>
);

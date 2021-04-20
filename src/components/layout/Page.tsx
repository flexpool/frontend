import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { clx } from 'src/utils/clx';
import './Page.scss';
import { ErrorBoundary } from '@sentry/react';

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

export const Page: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorContainer>
          <h1>Something went wrong.</h1>
          <p>Apologies for the inconvenience! Please try again later. </p>
        </ErrorContainer>
      }
    >
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

import React from 'react';

import styled from 'styled-components';
import { LoaderSpinner } from '../Loader/LoaderSpinner';

export const Page: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <main>{children}</main>
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

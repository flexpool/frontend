import React from 'react';
import { Card } from '../layout/Card';
import { LoaderOverlayWithin } from '../Loader/LoaderOverlayWithin';
import { OverlayWithin, OverlayWithinContent } from '../OverlayWithin';
import { ChartTitle } from '../Typo/ChartTitle';
import styled from 'styled-components/macro';

const EmptyImg = styled.img`
  height: 70%;
  margin-top: 2rem;
`;

export const ChartContainer: React.FC<{
  children: React.ReactNode;
  title?: string;
  isLoading?: boolean;
  dataState?: {
    data: any[] | null | undefined;
    isLoading: boolean;
    error?: any;
  };
}> = ({ children, title, isLoading, dataState }) => {
  console.log(dataState);
  return (
    <Card padding>
      {dataState &&
        (dataState.error || !dataState.data || dataState.data.length === 0) &&
        !dataState.isLoading && (
          <OverlayWithin>
            <OverlayWithinContent>
              <h2>No data available</h2>
              <EmptyImg src="/illustrations/stats.svg" alt="Empty chart" />
            </OverlayWithinContent>
          </OverlayWithin>
        )}
      {(isLoading || (dataState && dataState.isLoading)) && (
        <LoaderOverlayWithin />
      )}
      {title && <ChartTitle>{title}</ChartTitle>}
      {children}
    </Card>
  );
};

import React from 'react';
import { Card } from '../layout/Card';
import { LoaderOverlayWithin } from '../Loader/LoaderOverlayWithin';
import { ChartTitle } from '../Typo/ChartTitle';

export const ChartContainer: React.FC<{
  children: React.ReactNode;
  title?: string;
  isLoading?: boolean;
}> = ({ children, title, isLoading }) => {
  return (
    <Card padding>
      {isLoading && <LoaderOverlayWithin />}
      {title && <ChartTitle>{title}</ChartTitle>}
      {children}
    </Card>
  );
};

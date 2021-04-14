import React from 'react';
import { Card } from '../layout/Card';
import { LoaderOverlayWithin } from '../Loader/LoaderOverlayWithin';
import { OverlayWithin, OverlayWithinContent } from '../OverlayWithin';
import { ChartTitle } from '../Typo/ChartTitle';
import styled from 'styled-components/macro';
import { AxisRendererY, Chart, Legend } from '@amcharts/amcharts4/charts';
import { Container } from '@amcharts/amcharts4/core';

const EmptyImg = styled.img`
  height: 70%;
  margin-top: 2rem;
`;

const ChartCard = styled(Card)`
  padding: 1rem 1.25rem;
  @media screen and (max-width: 600px) {
    padding-right: 0rem;
    padding-left: 0rem;
  }
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
  return (
    <ChartCard>
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
    </ChartCard>
  );
};

export const responsiveRule = {
  relevant: (target: Container) => {
    if (target.pixelWidth <= 700) {
      return true;
    }
    return false;
  },
  state: (target: Container, stateId: string) => {
    if (target instanceof Chart) {
      let state = target.states.create(stateId);
      state.properties.paddingTop = 0;
      state.properties.paddingRight = 0;
      state.properties.paddingBottom = 0;
      state.properties.paddingLeft = -5;
      state.properties.fontSize = 12;
      return state;
    }

    if (target instanceof AxisRendererY) {
      const state = target.states.create(stateId);
      state.properties.maxLabelPosition = 0.99;
      state.properties.marginRight = -10;
      return state;
    }
    if (target instanceof Legend) {
      const state = target.states.create(stateId);
      state.properties.paddingRight = -10;
      state.properties.paddingLeft = -10;

      return state;
    }
  },
};

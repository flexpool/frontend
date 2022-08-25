import React, { useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import { intervalToDuration, Duration, format } from 'date-fns';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';

import { Content } from '../src/components/layout/Content';
import { Page } from '../src/components/layout/Page';
import { Card } from 'src/components/layout/Card';

import useEthMergeEstimatedDate from '@/hooks/api/useEthMergeEstimatedDate';

function addLeadingZeros(num: number, totalLength: number) {
  return String(num).padStart(totalLength, '0');
}

const SearchHeader = styled.div`
  border-bottom: 1px solid var(--border-color);
  padding: 16px 0;
  z-index: 1;
`;

const CountdownCard = styled(Card)`
  padding: 50px 60px;

  @media (max-width: 768px) {
    padding: 24px 30px;
  }
`;

const CountdownTitle = styled.div`
  color: var(--text-secondary);
  letter-spacing: -0.03em;
  font-weight: 700;
  font-size: 30px;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 0px;
  }
`;

const GrandNumber = styled.span`
  font-weight: 700;
  font-size: 96px;
  line-height: 116px;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  font-family: 'Roboto Mono', monospace;
  position: relative;
  left: -7px;

  @media (max-width: 768px) {
    font-size: 48px;
    left: -2px;
  }
`;

const CountdownNumberSubtitle = styled.span`
  display: block;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.03em;
  position: relative;
  top: -6px;
  color: var(--text-secondary);

  @media (max-width: 768px) {
    font-size: 14px;
    top: -28px;
  }
`;

const NumbersContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
`;

const EstimationTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 15px;

  letter-spacing: -0.03em;

  color: var(--text-secondary);
  margin-bottom: 6px;
`;

const EstimationContent = styled.div`
  font-weight: 700;
  font-size: 22px;
  color: var(--text-primary);
`;

const EstimationContainer = styled.div`
  display: inline-block;
`;

const Estimation = ({ title, content }: { title: string; content: string }) => {
  return (
    <EstimationContainer>
      <EstimationTitle>{title}</EstimationTitle>
      <EstimationContent>{content}</EstimationContent>
    </EstimationContainer>
  );
};

const Estimations = styled.div`
  margin-top: 34px;

  ${EstimationContainer} + ${EstimationContainer} {
    border-left: 1px solid var(--border-color);
    margin-left: 22px;
    padding-left: 22px;
  }

  @media (max-width: 768px) {
    margin-top: 0px;
  }
`;

const CountdownNumber = ({
  num,
  unit,
}: {
  num: number | undefined;
  unit: string;
}) => {
  return (
    <div style={{ display: 'inline-block' }}>
      <GrandNumber>
        {num !== undefined ? addLeadingZeros(num, 2) : '-'}
      </GrandNumber>
      <CountdownNumberSubtitle>{unit}</CountdownNumberSubtitle>
    </div>
  );
};

export const TheMergeAnnouncement = () => {
  const { data } = useEthMergeEstimatedDate();
  const { t: seoT, i18n } = useTranslation('seo');

  const [countdown, setCountdown] = useState<Duration | undefined>();

  useEffect(() => {
    if (data) {
      setCountdown(
        intervalToDuration({
          start: new Date(data * 1000),
          end: new Date(),
        })
      );

      const tick = () => {
        setCountdown(
          intervalToDuration({
            start: new Date(data * 1000),
            end: new Date(),
          })
        );
      };

      const id = setInterval(() => {
        tick();
      }, 1000);

      return () => {
        clearTimeout(id);
      };
    }
  }, [setCountdown, data]);

  return (
    <Page>
      <NextSeo title="The Merge Countdown" />
      <SearchHeader>
        <Content md padding>
          <h2>The Merge Countdown</h2>
        </Content>
      </SearchHeader>

      <Content md paddingLg>
        <CountdownCard>
          <CountdownTitle>The Merge will happen in</CountdownTitle>
          <NumbersContainer>
            <CountdownNumber num={countdown?.days} unit="Days" />
            <CountdownNumber num={countdown?.hours} unit="Hours" />
            <CountdownNumber num={countdown?.minutes} unit="Minutes" />
            <CountdownNumber num={countdown?.seconds} unit="Seconds" />
          </NumbersContainer>
          <Estimations>
            <Estimation
              title="Estimated Date"
              content={data ? format(data * 1000, 'MM.dd.yyyy') : '-'}
            />
            <Estimation
              title="Estimated Time"
              content={data ? format(data * 1000, 'KK:mm a') : '-'}
            />
          </Estimations>
        </CountdownCard>
      </Content>
    </Page>
  );
};

export default TheMergeAnnouncement;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'support',
        'cookie-consent',
        'seo',
      ])),
    },
  };
}

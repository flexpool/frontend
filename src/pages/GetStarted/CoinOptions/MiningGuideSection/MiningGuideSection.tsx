import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import { useTranslation } from 'next-i18next';
import { Spacer } from '@/components/layout/Spacer';
import { RadioGroup, GuideTypeRadio } from '../GuideTypeRadio';
import { ViewGuideButton } from '../ViewGuideButton';
import { PoolDetails } from '../PoolDetails';
import { MineableCoinHardware } from '@/pages/GetStarted/mineableCoinList';

const SectionWrapper = styled.div`
  padding: 20px 0px 68px;
`;

const MainCol = styled.div`
  flex-basis: 69%;
  border-right: 1px solid var(--border-color);
  flex-grow: 1;
`;

const SubCol = styled.div`
  flex-basis: 30%;
  min-width: 280px;
  padding: 34px 32px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  border-top: 1px solid var(--border-color);

  @media (max-width: 768px) {
    padding: 26px 24px;
  }
`;

const Heading = styled.h2`
  margin: 0;
  display: inline-block;
  margin: 10px;
  font-size: 24px;
  letter-spacing: -0.015em;
  color: var(--text-primary);
`;

const FlexEnd = styled.div`
  margin-top: auto;
`;

const SmallSprint = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  opacity: 0.5;
`;

type HardwareOption = {
  key: string;
  title: string;
};

const PoolGuideOptions = ({ options }: { options: HardwareOption[] }) => {
  const [selected, setSelected] = useState(0);

  return (
    <>
      <RadioGroup value={String(selected)}>
        {options.map((option, index) => {
          return (
            <GuideTypeRadio
              key={option.key}
              value={String(index)}
              selected={String(selected) === String(index)}
              onClick={() => {
                setSelected(index);
              }}
            >
              {option.title}
            </GuideTypeRadio>
          );
        })}
      </RadioGroup>
      <Spacer size="lg" />
      <FlexEnd>
        <ViewGuideButton href="">
          View <span>{options[selected].title}</span> Guide
        </ViewGuideButton>
      </FlexEnd>
    </>
  );
};

const Layout = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 10px;
`;

const LayoutHeader = styled.div`
  padding: 15px 40px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 15px 26px;
  }
`;

const LayoutBody = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

type Props = {
  ticker: string;
  name: string;
};

export const MiningGuideSection = ({ ticker, name }: Props) => {
  const { t } = useTranslation('get-started');

  const poolDetails = t(`detail_${ticker.toLowerCase()}.pool_details`, {
    returnObjects: true,
  }) as { key: string; value: string }[];

  const poolHw = t(`detail_${ticker.toLowerCase()}.hardware`, {
    returnObjects: true,
  }) as MineableCoinHardware[];

  return (
    <SectionWrapper>
      <Layout>
        <LayoutHeader>
          <Image
            src={getCoinIconUrl(ticker)}
            width={30}
            height={30}
            alt={'image'}
          />
          <Heading>{name}</Heading>
        </LayoutHeader>

        <LayoutBody>
          <MainCol>
            <PoolDetails items={poolDetails} />
          </MainCol>
          <SubCol>
            <PoolGuideOptions options={poolHw} />
          </SubCol>
        </LayoutBody>
      </Layout>
    </SectionWrapper>
  );
};

export default MiningGuideSection;

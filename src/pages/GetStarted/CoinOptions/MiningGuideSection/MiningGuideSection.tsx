import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import { useTranslation } from 'next-i18next';
import { Spacer } from '@/components/layout/Spacer';
import { RadioGroup, GuideTypeRadio } from '../GuideTypeRadio';
import { ViewGuideButton } from '../ViewGuideButton';
import { PoolDetails } from '../PoolDetails';
import {
  MineableCoinHardware,
  mineableCoins,
} from '@/pages/GetStarted/mineableCoinList';
import { BiSupport } from 'react-icons/bi';
import { RiTeamLine } from 'react-icons/ri';
import { GiReceiveMoney, GiSparkles } from 'react-icons/gi';
import { MineableCoin } from '@/pages/GetStarted/mineableCoinList';
import { merge } from 'lodash';

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
  background-color: var(--bg-secondary);

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

const SubHeading = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  opacity: 0.5;
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

const HelpText = styled(SmallSprint)`
  margin-top: 8px;
  cursor: pointer;
  font-weight: 400;
  font-size: 0.875rem;
  color: #77869e;
  opacity: 1;
  &:hover {
    text-decoration: underline;
  }
`;

type HardwareOption = {
  key: string;
  title: string;
  tag?: string;
};

const Tag = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--success);
  background-color: #15cd7221;
  border-radius: 50px;
  padding: 5px 10px;
  font-size: 12px;
  margin: 0 6px;
  color: var(--success);
`;

const PoolGuideOptions = ({
  options,
  coin,
}: {
  coin: string;
  options: HardwareOption[];
}) => {
  const [selected, setSelected] = useState(0);
  const { t } = useTranslation('get-started');

  const key = options[selected].key;

  let guideLink = `/get-started/${coin}/${key}`;
  let color = 'var(--primary)';

  if (key === 'flexfarmer') {
    guideLink = 'https://farmer.flexpool.io';
    color = 'var(--success)';
  }

  if (key === 'nicehash') {
    color = 'var(--warning)';
  }

  return (
    <>
      <h2>{t('list.start_today')}</h2>
      <SubHeading>{t('list.begin_experience')}</SubHeading>
      <Spacer size="md" />
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
              {option.tag && <Tag>{option.tag}</Tag>}
            </GuideTypeRadio>
          );
        })}
      </RadioGroup>
      <Spacer size="lg" />
      <FlexEnd>
        <ViewGuideButton href={guideLink} color={color}>
          {t('list.view_button', {
            name: options[selected].title,
          })}
        </ViewGuideButton>
      </FlexEnd>
    </>
  );
};

const Layout = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
`;

const LayoutHeader = styled.div`
  padding: 18px 40px;
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
  coin: MineableCoin;
};

const PerksWrapper = styled.div`
  padding: 26px 48px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 24px 26px 30px;
    display: none;
  }
`;

const PerkContainer = styled.div`
  flex-basis: 50%;
  display: flex;
  align-items: flex-start;
  font-size: 15px;
  font-weight: 500;
  padding: 16px 12px 16px 0; ;
`;

const Perk = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <PerkContainer>
      <div
        style={{
          color: 'var(--success)',
          margin: '0 8px 0 0',
        }}
      >
        {icon}
      </div>
      <div>
        {title}
        <SmallSprint>{description}</SmallSprint>
      </div>
    </PerkContainer>
  );
};

const PoolPerks = () => {
  const { t } = useTranslation('get-started');

  return (
    <PerksWrapper>
      <Perk
        icon={<RiTeamLine size={20} />}
        title={t('list.perks.0.title')}
        description={t('list.perks.0.description')}
      />
      <Perk
        icon={<BiSupport size={20} />}
        title={t('list.perks.1.title')}
        description={t('list.perks.1.description')}
      />
      <Perk
        icon={<GiReceiveMoney size={20} />}
        title={t('list.perks.2.title')}
        description={t('list.perks.2.description')}
      />
      <Perk
        icon={<GiSparkles size={20} />}
        title={t('list.perks.3.title')}
        description={t('list.perks.3.description')}
      />
    </PerksWrapper>
  );
};

export const MiningGuideSection = ({ ticker, name, coin }: Props) => {
  const { t } = useTranslation('get-started');

  var poolDetails = t(`detail_${ticker.toLowerCase()}.pool_details`, {
    returnObjects: true,
  }) as { key: string; value: string }[];

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const poolHw = t(`detail_${ticker.toLowerCase()}.hardware`, {
    returnObjects: true,
  }) as MineableCoinHardware[];

  const mergedHw = merge(
    [],
    mineableCoin?.hardware,
    poolHw
  ) as MineableCoinHardware[];

  if (typeof poolHw === 'string') {
    return <></>;
  }

  const hardwareOptions = poolHw.map((hw) => {
    let tag;
    if (hw.key === 'flexfarmer') tag = 'New';

    return {
      ...hw,
      tag,
    };
  });

  if (coin.nicehashAvailable) {
    hardwareOptions.push({
      key: 'nicehash',
      title: 'NiceHash Rental',
      miners: [],
      tag: null,
    });
  }

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
            <PoolPerks />
          </MainCol>
          <SubCol>
            <PoolGuideOptions coin={ticker} options={mergedHw} />
          </SubCol>
        </LayoutBody>
      </Layout>
    </SectionWrapper>
  );
};

export default MiningGuideSection;

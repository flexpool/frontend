import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { Redirect, useRouteMatch } from 'react-router';
import { Img } from 'src/components/Img';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import { Highlight } from 'src/components/Typo/Typo';
import styled from 'styled-components/macro';
import { ServerList } from '../GPU/PingTest.section';
import { mineableCoins } from '../mineableCoinList';

import nh1 from './assets/nh_1.jpg';
import nh2 from './assets/nh_2.jpg';
import nh3 from './assets/nh_3.jpg';

const GuideImg = styled(Img)`
  max-width: 462px;
  width: 100%;
  margin-top: 2rem;
`;

export const NicehashGuidePage = () => {
  const {
    params: { ticker },
  } = useRouteMatch<{
    ticker?: string;
  }>();

  const { t } = useTranslation('get-started');

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
  }, [ticker]);

  if (!mineableCoin) {
    return <Redirect to="/get-started" />;
  }

  const algo =
    mineableCoin.algorithm === mineableCoin.nicehash_algorithm
      ? mineableCoin.algorithm
      : `${mineableCoin.nicehash_algorithm} (${mineableCoin.algorithm})`;

  return (
    <Page>
      <Helmet>
        <title>{t('nicehash.head_title')}</title>
      </Helmet>
      <Content md paddingLg>
        <h1>{t('nicehash.title')}</h1>
        <p>{t('nicehash.description')}</p>

        <h2>
          <Highlight>#1</Highlight> {t('nicehash.step_one.title')}
        </h2>
        {(t('nicehash.step_one.description', {
          returnObjects: true,
          algorithm: algo,
        }) as string[]).map((p) => (
          <p key={p}>{p}</p>
        ))}
        <LinkOut href={nh1}>
          <GuideImg src={nh1} alt="nicehash guide" />
        </LinkOut>
        <h2>
          <Highlight>#2 </Highlight>
          {t('nicehash.step_two.title')}
        </h2>
        <Trans
          components={{
            strong: <strong />,
          }}
        >
          {(t('nicehash.step_two.description', {
            returnObjects: true,
            algorithm: algo,
          }) as string[]).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Trans>
        <Spacer />
        <ServerList data={mineableCoin?.regions} />
        <Spacer />
        <LinkOut href={nh2}>
          <GuideImg src={nh2} alt="nicehash guide" />
        </LinkOut>
        <h2>
          <Highlight>#3 </Highlight>
          {t('nicehash.step_three.title')}
        </h2>
        <Trans
          components={{
            strong: <strong />,
          }}
        >
          {(t('nicehash.step_three.description', {
            returnObjects: true,
            algorithm: algo,
          }) as string[]).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Trans>
        <LinkOut href={nh3}>
          <GuideImg src={nh3} alt="nicehash guide" />
        </LinkOut>
        <h2>
          <Highlight>#4</Highlight> {t('nicehash.step_four.title')}
        </h2>
        <Trans
          components={{
            strong: <strong />,
          }}
        >
          {(t('nicehash.step_four.description', {
            returnObjects: true,
            algorithm: algo,
          }) as string[]).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Trans>
      </Content>
    </Page>
  );
};

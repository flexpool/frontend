import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'next-i18next';
import { Redirect, useRouteMatch } from 'react-router';
import { CopyButton } from 'src/components/CopyButton';
import { Img } from 'src/components/Img';
import { Content } from 'src/components/layout/Content';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import { Highlight, Mono, Ws } from 'src/components/Typo/Typo';
import styled from 'styled-components';
import { MineableCoinRegion, mineableCoins } from '../mineableCoinList';

import nh1 from './assets/nh_1.jpg';
import nh2 from './assets/nh_2.jpg';
import nh3 from './assets/nh_3.jpg';

export const ServerList: React.FC<{
  data: MineableCoinRegion[];
}> = ({ data }) => {
  const { t } = useTranslation('get-started');

  const cols: DynamicListColumn<MineableCoinRegion>[] = React.useMemo(
    () => [
      {
        title: t('detail.region.table_head.location'),
        Component: ({ data }) => {
          return (
            <Ws>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Img
                  src={`https://static.flexpool.io/assets/countries/${data.imageCode}.svg`}
                  style={{ width: '32px', marginRight: '10px' }}
                  alt={data.imageCode}
                />
                {t(`regions.${data.code}`)}
              </div>
            </Ws>
          );
        },
      },
      {
        title: t('detail.region.table_head.domain'),
        Component: ({ data }) => (
          <Mono>
            <Ws>
              {data.domain} <CopyButton text={data.domain} />
            </Ws>
          </Mono>
        ),
      },
      {
        title: t('detail.region.table_head.port'),
        Component: ({ data }) => (
          <Mono>
            <Ws>{data.high_diff_avail ? '14444' : '5555'}</Ws>
          </Mono>
        ),
      },
    ],
    [t]
  );

  const serverList = React.useMemo(() => {
    return data.filter((item) => item.high_diff_avail);
  }, [data]);

  return <DynamicList data={serverList} columns={cols} />;
};

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

import React from 'react';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
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
import { MineableCoinRegion, mineableCoins } from '../mineableCoinList';
import { NextSeo } from 'next-seo';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const serverList = React.useMemo(() => {
    return data.filter((item) => item.high_diff_avail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <DynamicList data={serverList} columns={cols} />;
};

const GuideImg = styled(Img)`
  max-width: 462px;
  width: 100%;
  margin-top: 2rem;
`;

export const NicehashGuidePage = () => {
  const router = useRouter();
  const ticker = router.query.ticker;

  const { t, i18n } = useTranslation('get-started');
  const { t: seoT } = useTranslation('seo');

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mineableCoin) {
    router.push('/get-started');
  }

  const algo =
    mineableCoin?.algorithm === mineableCoin?.nicehash_algorithm
      ? mineableCoin?.algorithm
      : `${mineableCoin?.nicehash_algorithm} (${mineableCoin?.algorithm})`;

  const stepOneDirections = t('nicehash.step_one.description', {
    returnObjects: true,
    algorithm: algo,
  });
  const stepTwoDirections = t('nicehash.step_two.description', {
    returnObjects: true,
    algorithm: algo,
  });
  const stepThreeDirections = t('nicehash.step_three.description', {
    returnObjects: true,
    algorithm: algo,
  });
  const stepFourDirections = t('nicehash.step_four.description', {
    returnObjects: true,
    algorithm: algo,
  });

  const seoTitle = seoT('title.get_started_nicehash', {
    coinName: mineableCoin?.name,
    coinTicker: mineableCoin?.ticker.toUpperCase(),
  });

  const seoDescription = seoT('website_description.get_started_nicehash', {
    coinName: mineableCoin?.name,
    coinTicker: mineableCoin?.ticker.toUpperCase(),
    coinAlgorithm: mineableCoin?.algorithm,
  });

  return (
    <Page>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        openGraph={{
          title: seoTitle,
          description: seoDescription,
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.get_started_nicehash', {
              coinName: mineableCoin?.name,
              coinTicker: mineableCoin?.ticker.toUpperCase(),
              coinAlgorithm: mineableCoin?.algorithm,
            }),
          },
        ]}
      />
      <Content md paddingLg>
        <h1>{t('nicehash.title')}</h1>
        <p>{t('nicehash.description')}</p>

        <h2>
          <Highlight>#1</Highlight> {t('nicehash.step_one.title')}
        </h2>
        {stepOneDirections && (
          <>
            {Object.keys(stepOneDirections).map((p) => (
              <p key={p}>{stepOneDirections[p]}</p>
            ))}
          </>
        )}
        <LinkOut href={'/nicehash-guide/nh_1.jpg'}>
          <GuideImg src={'/nicehash-guide/nh_1.jpg'} alt="nicehash guide" />
        </LinkOut>
        <h2>
          <Highlight>#2 </Highlight>
          {t('nicehash.step_two.title')}
        </h2>
        {stepTwoDirections && (
          <>
            {Object.keys(stepTwoDirections).map((p) => (
              <p
                key={p}
                dangerouslySetInnerHTML={{ __html: stepTwoDirections[p] }}
              />
            ))}
          </>
        )}
        <Spacer />
        <ServerList data={mineableCoin?.regions as MineableCoinRegion[]} />
        <Spacer />
        <LinkOut href={'/nicehash-guide/nh_2.jpg'}>
          <GuideImg src={'/nicehash-guide/nh_2.jpg'} alt="nicehash guide" />
        </LinkOut>
        <h2>
          <Highlight>#3 </Highlight>
          {t('nicehash.step_three.title')}
        </h2>
        {stepThreeDirections && (
          <>
            {Object.keys(stepThreeDirections).map((p) => (
              <p
                key={p}
                dangerouslySetInnerHTML={{ __html: stepThreeDirections[p] }}
              />
            ))}
          </>
        )}
        <LinkOut href={'/nicehash-guide/nh_3.jpg'}>
          <GuideImg src={'/nicehash-guide/nh_3.jpg'} alt="nicehash guide" />
        </LinkOut>
        <h2>
          <Highlight>#4</Highlight> {t('nicehash.step_four.title')}
        </h2>
        {stepFourDirections && (
          <>
            {Object.keys(stepFourDirections).map((p) => (
              <p
                key={p}
                dangerouslySetInnerHTML={{ __html: stepFourDirections[p] }}
              />
            ))}
          </>
        )}
      </Content>
    </Page>
  );
};

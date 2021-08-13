import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Button } from 'src/components/Button';
import { CoinLogo } from 'src/components/CoinLogo';
import DynamicList from 'src/components/layout/List/List';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { Ws } from 'src/components/Typo/Typo';
import styled from 'styled-components';

import { MineableCoinHardware, mineableCoins } from './mineableCoinList';

const MineableCoinWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  table td {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    font-size: 0.875rem;
  }
`;
const Title = styled.h3``;

const MineableCoinGrid = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 400px));
  gap: 1rem;
  width: 100%;

  .defWrap {
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-top: 2rem;
  }
`;

const CoinContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GuidesList = styled.div`
  width: 100%;
  padding: 0 1rem;
  display: grid;
  grid-gap: 1rem;
`;

export const MineableCoinList: React.FC = () => {
  const { t } = useTranslation('get-started');
  return (
    <Page>
      <h1>{t('list.title')}</h1>
      <Spacer />
      {t && (
        <MineableCoinGrid>
          {mineableCoins.map((item) => {
            const poolDetails = t(`detail_${item.ticker.toLowerCase()}.pool_details`, {
              returnObjects: true,
            }) as { key: string; value: string }[];

            const poolHw = t(`detail_${item.ticker.toLowerCase()}.hardware`, {
              returnObjects: true,
            }) as MineableCoinHardware[];

            if (typeof poolHw === 'string') {
              return <></>;
            }

            return (
              <MineableCoinWrapper key={item.name}>
                <CoinContent>
                  <CoinLogo ticker={item.ticker} size="xl" />
                  <Title>{item.name}</Title>
                </CoinContent>
                <GuidesList>
                  {poolHw.map((itemHw) => (
                    <Link
                      key={itemHw.key}
                      href={`/get-started/${item.ticker}/${itemHw.key}`}
                      passHref
                    >
                      <Button
                        shape="block"
                        size="sm"
                        variant={itemHw.key === 'flexfarmer' ? 'success' : 'primary'}
                      >
                        {itemHw.key === 'flexfarmer' ? (
                          <>
                            +&nbsp;<b>{itemHw.title}</b>&nbsp;[NEW]
                          </>
                        ) : (
                          itemHw.title
                        )}
                      </Button>
                    </Link>
                  ))}
                  {item.nicehashAvailable ? (
                    <Link href={`/get-started/${item.ticker}/nicehash`} passHref>
                      <Button shape="block" size="sm" variant="warning">
                        {t('list.nicehash_rental_button')}
                      </Button>
                    </Link>
                  ) : null}
                </GuidesList>
                <DynamicList
                  wrapperProps={{
                    className: 'defWrap',
                  }}
                  hideHead
                  data={poolDetails}
                  columns={[
                    {
                      title: '',
                      Component: ({ data }) => <>{data.key}</>,
                    },
                    {
                      title: '',
                      Component: ({ data }) => <Ws>{data.value}</Ws>,
                    },
                  ]}
                />
              </MineableCoinWrapper>
            );
          })}
        </MineableCoinGrid>
      )}
    </Page>
  );
};

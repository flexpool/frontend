import React from 'react';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import styled from 'styled-components';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { TableCellSpinner } from 'src/components/Loader/TableCellSpinner';
import { useTranslation } from 'next-i18next';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import { BiTransferAlt } from 'react-icons/bi';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import ListDateSwitchButton from 'src/components/ButtonVariants/ListDateSwitchButton';
import { getCoinLink } from 'src/utils/coinLinks.utils';
import { LinkOutCoin } from 'src/components/LinkOut';
import { useMinerBlockRewardsQuery } from '@/hooks/api/useMinerBlockRewardsQuery';

const PAGE_SIZE = 5;

export type ApiBlock = {
  share: number;
  reward: number;
  confirmed: boolean;
  blockNumber: number;
  timestamp: number;
  hash: string;
  blockType: 'block' | 'uncle' | 'orphan';
};

const BlockType = styled.span<{ type: ApiBlock['blockType'] }>`
  display: inline-block;
  text-transform: capitalize;
  white-space: nowrap;
  & + * {
    margin-left: 0.5rem;
  }

  ${(p) =>
    p.type === 'uncle' &&
    `
      color: var(--warning);
  `}
  ${(p) =>
    p.type === 'orphan' &&
    `
      color: var(--text-tertiary);
  `}

  + * svg {
    fill: var(--text-tertiary);
  }
`;

export const MinerRewardsBlocksSection: React.FC<{
  address: string;
}> = ({ address }) => {
  const { t } = useTranslation('blocks');
  const coinTicker = useActiveCoinTicker();
  const blockState = useMinerBlockRewardsQuery({
    address,
    coin: coinTicker,
  });

  const [currentPage, setCurrentPage] = React.useState(0);
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const [dateView, setDateView] = useLocalStorageState<
    'full_date' | 'distance'
  >('blockDateView', 'distance');

  const blocks = blockState.data?.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const totalPages = blockState.data
    ? Math.ceil(blockState.data.length / 5)
    : 0;

  const dateFormatter = useLocalizedDateFormatter();

  const onRowClick = React.useCallback(
    (data: ApiBlock) => {
      const url =
        data.blockType !== 'orphan' &&
        getCoinLink(data.blockType, data.hash, coinTicker);
      if (url) {
        window.open(url, '_blank');
      }
    },
    [coinTicker]
  );

  const onRowClickAllowed = React.useCallback((data: ApiBlock) => {
    if (data.blockType !== 'orphan') {
      return true;
    }
    return false;
  }, []);

  const blockCols: {
    [key: string]: DynamicListColumn<
      ApiBlock,
      {
        coinTicker: string;
        totalPages: number;
        currentPage: number;
        totalItems: number;
      }
    >;
  } = React.useMemo(
    () => ({
      number: {
        title:
          coinTicker === 'eth' || coinTicker === 'etc'
            ? t('table.table_head.number')
            : t('table.table_head.height'),
        skeletonWidth: 80,
        Component: ({ data, config }) => {
          const content = (
            <Ws
              className={
                data.blockType !== 'orphan' ? 'item-hover-higjlight' : ''
              }
            >
              {data.blockNumber}
              {!data.confirmed && (
                <Tooltip icon={<TableCellSpinner />}>
                  <TooltipContent message={t('waiting_confirmation_tooltip')} />
                </Tooltip>
              )}
            </Ws>
          );
          return <>{content}</>;
        },
      },
      type: {
        title: t('table.table_head.type'),
        skeletonWidth: 50,
        Component: ({ data }) => {
          const msg =
            data.blockType === 'orphan'
              ? t('orphan_tooltip')
              : data.blockType === 'uncle'
              ? t('uncle_tooltip')
              : null;

          return (
            <Ws>
              <BlockType type={data.blockType}>
                {t(`type.${data.blockType}`)}
              </BlockType>
              {msg && (
                <Tooltip>
                  <TooltipContent
                    message={msg}
                    // action={<a href="/">Learn more</a>}
                  />
                </Tooltip>
              )}
            </Ws>
          );
        },
      },
      date: {
        title: t('table.table_head.date'),
        skeletonWidth: 180,
        Component: ({ data }) => {
          return (
            <ListDateSwitchButton
              onClick={(e) => {
                setDateView(
                  dateView === 'full_date' ? 'distance' : 'full_date'
                );
                e.stopPropagation();
              }}
            >
              {dateView === 'full_date'
                ? dateFormatter.dateAndTime(data.timestamp * 1000)
                : dateFormatter.distanceFromNow(data.timestamp * 1000)}
              <BiTransferAlt />
            </ListDateSwitchButton>
          );
        },
      },
      share: {
        title: t('table.table_head.share'),
        alignRight: true,
        skeletonWidth: 80,
        Component: ({ data }) => {
          return (
            <Mono>
              <Ws>{(data.share * 100).toFixed(6)}%</Ws>
            </Mono>
          );
        },
      },
      reward: {
        title: t('table.table_head.reward'),
        alignRight: true,
        skeletonWidth: 80,
        Component: ({ data }) => {
          return (
            <Mono>
              <Ws>
                {activeCoinFormatter(data.reward, {
                  maximumSignificantDigits: 6,
                })}
              </Ws>
            </Mono>
          );
        },
      },
      blockHash: {
        title: t('table.table_head.hash'),
        skeletonWidth: 200,
        alignRight: true,
        Component: ({ data, config }) => (
          <Mono>
            <Ws
              className={
                data.blockType !== 'orphan' ? 'item-hover-higjlight' : ''
              }
            >
              <LinkOutCoin
                type={data.blockType}
                hash={data.hash}
                hashLength={10}
                coin={config.coinTicker}
              />
            </Ws>
          </Mono>
        ),
      },
    }),
    [activeCoinFormatter, t, dateFormatter, dateView, setDateView, coinTicker]
  );

  return (
    <>
      <h2>{t('table.rewards_block_list_title')}</h2>
      <DynamicList
        onRowClick={onRowClick}
        onRowClickAllowed={onRowClickAllowed}
        pagination={{
          currentPage,
          setCurrentPage,
          totalPages,
        }}
        isLoading={blockState.isLoading}
        loadingRowsCount={5}
        data={blocks || []}
        config={{
          coinTicker,
          totalPages,
          totalItems: 0,
          currentPage,
        }}
        columns={[
          blockCols.number,
          blockCols.type,
          blockCols.date,
          blockCols.share,
          blockCols.reward,
          blockCols.blockHash,
        ]}
        contentEmpty={
          <h3>
            {!!address ? t('table.title_miner_zero') : t('table.title_zero')}
          </h3>
        }
      />
    </>
  );
};

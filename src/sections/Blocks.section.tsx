import React from 'react';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import { LinkMiner } from 'src/components/LinkMiner';
import { Luck } from 'src/components/Luck';
import styled from 'styled-components';
import { getCoinLink } from 'src/utils/coinLinks.utils';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { LinkOut, LinkOutCoin } from 'src/components/LinkOut';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { TableCellSpinner } from 'src/components/Loader/TableCellSpinner';
import { useTranslation } from 'next-i18next';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import { BiTransferAlt } from 'react-icons/bi';
import ListDateSwitchButton from 'src/components/ButtonVariants/ListDateSwitchButton';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import router from 'next/router';
import { findMinableCoinByTicker } from '@/pages/GetStarted/mineableCoinList.utils';

type ApiBlock = {
  confirmed: boolean;
  difficulty: number;
  hash: string;
  luck: number;
  miner: string;
  number: number;
  region: string;
  reward: number;
  roundTime: number;
  timestamp: number;
  type: 'block' | 'uncle' | 'orphan';
};

type ApiBlocks = {
  totalItems: number;
  totalPages: number;
  data: ApiBlock[];
};

const Region = styled.span`
  text-transform: uppercase;
`;

const BlockLink = styled(LinkOut)`
  color: var(--text-primary);
`;

const BlockType = styled.span<{ type: ApiBlock['type'] }>`
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

export const BlocksSection: React.FC<{ address?: string }> = ({ address }) => {
  const { t } = useTranslation('blocks');
  const blockState = useAsyncState<ApiBlocks>('blocks', {
    totalItems: 0,
    totalPages: 0,
    data: [],
  });
  const coinTicker = useActiveCoinTicker();
  const [currentPage, setCurrentPage] = React.useState(0);
  const [dateView, setDateView] = useLocalStorageState<
    'full_date' | 'distance'
  >('blockDateView', 'distance');
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const dateFormatter = useLocalizedDateFormatter();
  const activeCoinTicker = useActiveCoinTicker();

  React.useEffect(() => {
    blockState.start(
      fetchApi(address ? '/miner/blocks' : '/pool/blocks', {
        query: { coin: coinTicker, page: currentPage, address },
      })
    );
    // eslint-disable-next-line
  }, [currentPage, coinTicker, address]);

  const totalPages = blockState.data?.totalPages || 0;

  const blocks = React.useMemo(() => {
    return blockState.data?.data || [];
  }, [blockState.data]);

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
      countNumber: {
        title: '#',
        skeletonWidth: 40,
        Component: ({ config, index }) => {
          return (
            <Mono>
              #
              {(config.totalItems % 10) -
                index +
                (config.totalPages - (config.currentPage + 1)) * 10}
            </Mono>
          );
        },
      },
      number: {
        title:
          activeCoinTicker === 'eth' || activeCoinTicker === 'etc'
            ? t('table.table_head.number')
            : activeCoinTicker === 'zil'
            ? `DS ${t('table.table_head.height')}`
            : t('table.table_head.height'),
        skeletonWidth: 80,
        Component: ({ data, config }) => {
          const url =
            data.type !== 'orphan' &&
            getCoinLink(
              data.type,
              coinTicker === 'zil' ? String(data.number) : data.hash,
              config.coinTicker
            );

          const content = (
            <Ws
              className={data.type !== 'orphan' ? 'item-hover-higjlight' : ''}
            >
              {data.number}
              {!data.confirmed && (
                <Tooltip icon={<TableCellSpinner />}>
                  <TooltipContent message={t('waiting_confirmation_tooltip')} />
                </Tooltip>
              )}
            </Ws>
          );

          if (url) {
            return (
              <BlockLink onClick={(e) => e.stopPropagation()} href={url}>
                {content}
              </BlockLink>
            );
          }
          return <>{content}</>;
        },
      },
      type: {
        title: t('table.table_head.type'),
        skeletonWidth: 50,
        Component: ({ data }) => {
          const msg =
            data.type === 'orphan'
              ? t('orphan_tooltip')
              : data.type === 'uncle'
              ? t('uncle_tooltip')
              : null;

          return (
            <Ws>
              <BlockType type={data.type}>
                {t(
                  `type.${
                    coinTicker === 'zil' && data.type === 'block'
                      ? 'block_round'
                      : data.type
                  }`
                )}
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
      reward: {
        title: t('table.table_head.reward'),
        skeletonWidth: 80,
        Component: ({ data }) => {
          return (
            <Mono>
              <Ws>{activeCoinFormatter(data.reward)}</Ws>
            </Mono>
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
      region: {
        title: t('table.table_head.region'),
        skeletonWidth: 40,
        Component: ({ data }) => <Region>{data.region}</Region>,
      },
      miner: {
        title: t('table.table_head.miner'),
        skeletonWidth: 210,
        Component: ({ data, config }) => (
          <Mono>
            <Ws>
              <LinkMiner
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/miner/${config.coinTicker}/${data.miner}`);
                }}
                coin={config.coinTicker}
                address={data.miner}
              />
            </Ws>
          </Mono>
        ),
      },
      roundTime: {
        title: t('table.table_head.round_time'),
        skeletonWidth: 75,
        Component: ({ data }) => {
          return (
            <Ws>
              {dateFormatter.durationWords(data.roundTime, {
                includeSeconds: true,
                short: true,
              })}
            </Ws>
          );
        },
      },
      luck: {
        title: t('table.table_head.luck'),
        skeletonWidth: 70,
        Component: ({ data }) => <Luck value={data.luck} />,
      },
      nodeCount: {
        title: t('table.table_head.node_count'),
        skeletonWidth: 210,
        Component: ({ data, config }) => (
          <Mono>
            <Ws>{data.difficulty}</Ws>
          </Mono>
        ),
      },
      blockHash: {
        title: t('table.table_head.hash'),
        skeletonWidth: 200,
        alignRight: true,
        Component: ({ data, config }) => (
          <Mono>
            <Ws
              className={data.type !== 'orphan' ? 'item-hover-higjlight' : ''}
            >
              <LinkOutCoin
                type={data.type}
                hash={data.hash}
                hashLength={10}
                coin={config.coinTicker}
              />
            </Ws>
          </Mono>
        ),
      },
    }),
    [t, dateFormatter, dateView, setDateView, activeCoinFormatter]
  );

  const columns = React.useMemo(() => {
    // if no address, displaying default view
    if (!address) {
      var cols = [blockCols.number, blockCols.type, blockCols.date];

      const mineableCoin = findMinableCoinByTicker(coinTicker);

      if (mineableCoin?.configs?.showBlocksRegion) {
        cols.push(blockCols.region);
      }

      if (coinTicker !== 'zil') {
        cols.push(blockCols.miner);
      }

      cols.push(blockCols.reward);

      if (coinTicker !== 'zil') {
        cols.push(blockCols.roundTime, blockCols.luck);
      } else {
        cols.push(blockCols.nodeCount);
      }

      return cols;
    }
    return [
      blockCols.countNumber,
      blockCols.number,
      blockCols.type,
      blockCols.date,
      blockCols.region,
      blockCols.blockHash,
    ];
  }, [address, blockCols, coinTicker]);

  const onRowClick = React.useCallback(
    (data: ApiBlock) => {
      const url =
        data.type !== 'orphan' &&
        getCoinLink(
          data.type,
          coinTicker === 'zil' ? String(data.number) : data.hash,
          coinTicker
        );
      if (url) {
        window.open(url, '_blank');
      }
    },
    [coinTicker]
  );

  const onRowClickAllowed = React.useCallback((data: ApiBlock) => {
    if (data.type !== 'orphan') {
      return true;
    }
    return false;
  }, []);

  return (
    <>
      {blockState.data && blockState.data.totalItems > 0 ? (
        coinTicker === 'zil' ? (
          <h2>
            {t('table.title_rounds', { count: blockState.data.totalItems })}
          </h2>
        ) : address ? (
          <h2>
            {t('table.title_miner', { count: blockState.data.totalItems })}
          </h2>
        ) : (
          <h2>{t('table.title', { count: blockState.data.totalItems })}</h2>
        )
      ) : null}

      <DynamicList
        onRowClick={onRowClick}
        onRowClickAllowed={onRowClickAllowed}
        pagination={{
          currentPage,
          setCurrentPage,
          totalPages,
        }}
        isLoading={blockState.isLoading}
        loadingRowsCount={10}
        data={blocks}
        config={{
          coinTicker,
          totalPages,
          totalItems: blockState.data?.totalItems || 0,
          currentPage,
        }}
        columns={columns}
        contentEmpty={
          <h3>
            {!!address ? t('table.title_miner_zero') : t('table.title_zero')}
          </h3>
        }
      />
    </>
  );
};

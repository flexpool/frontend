import React from 'react';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
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
import { useMinerBlocksQuery } from '@/hooks/api/useMinerBlocksQuery';
import { BiTransferAlt } from 'react-icons/bi';

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

const ButtonDateSwitch = styled(Ws)`
  padding: 0 0.35rem;
  outline: none;
  border: none;
  color: var(--text-secondary);
  svg {
    opacity: 0.5;
    margin-left: 0.3rem;
  }
  &:hover svg {
    color: var(--primary);
    opacity: 1;
  }
`;

export const BlocksSection: React.FC<{
  address: string;
}> = ({ address }) => {
  const { t } = useTranslation('blocks');
  const coinTicker = useActiveCoinTicker();
  const [currentPage, setCurrentPage] = React.useState(0);
  const [dateView, setDateView] = useLocalStorageState<
    'full_date' | 'distance'
  >('blockDateView', 'distance');

  const dateFormatter = useLocalizedDateFormatter();

  const blockState = useMinerBlocksQuery({
    coin: coinTicker,
    page: currentPage,
    address,
  });

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
          coinTicker === 'eth' || coinTicker === 'etc'
            ? t('table.table_head.number')
            : t('table.table_head.height'),
        skeletonWidth: 80,
        Component: ({ data, config }) => {
          const url =
            data.type !== 'orphan' &&
            getCoinLink(data.type, data.hash, config.coinTicker);

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
              <BlockType type={data.type}>{t(`type.${data.type}`)}</BlockType>
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
            <ButtonDateSwitch
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
            </ButtonDateSwitch>
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
    [t, dateFormatter, dateView, setDateView]
  );

  const columns = React.useMemo(() => {
    // if no address, displaying default view
    if (!address) {
      return [
        blockCols.number,
        blockCols.type,
        blockCols.date,
        blockCols.region,
        blockCols.miner,
        blockCols.roundTime,
        blockCols.luck,
      ];
    }
    return [
      blockCols.countNumber,
      blockCols.number,
      blockCols.type,
      blockCols.date,
      blockCols.region,
      blockCols.blockHash,
    ];
  }, [address, blockCols]);

  const onRowClick = React.useCallback(
    (data: ApiBlock) => {
      const url =
        data.type !== 'orphan' && getCoinLink(data.type, data.hash, coinTicker);
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
      {address && blockState.data && blockState.data.totalItems > 0 && (
        <h2>{t('table.title_miner', { count: blockState.data.totalItems })}</h2>
      )}
      {!address && blockState.data && blockState.data.totalItems > 0 && (
        <h2>{t('table.title', { count: blockState.data.totalItems })}</h2>
      )}
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

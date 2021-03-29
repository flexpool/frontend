import React from 'react';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import format from 'date-fns/format';
import { useActiveCoinTickerDisplayValue } from 'src/hooks/useDisplayReward';
import { LinkMiner } from 'src/components/LinkMiner';
import { Luck } from 'src/components/Luck';
import styled from 'styled-components';
import { getBlockLink } from 'src/utils/blockLink.utils';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { LinkOut, LinkOutCoin } from 'src/components/LinkOut';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { dateUtils } from 'src/utils/date.utils';

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
  type: string;
};

type ApiBlocks = {
  totalItems: number;
  totalPages: number;
  data: ApiBlock[];
};

const Region = styled.span`
  text-transform: uppercase;
`;

const TypeOrphan = styled.span`
  text-transform: capitalize;
  color: var(--text-tertiary);
`;

const BlockLink = styled(LinkOut)`
  color: var(--text-primary);
`;
const TypeBlock = styled.span`
  text-transform: capitalize;
`;
const TypeUncle = styled.span`
  text-transform: capitalize;
  color: var(--warning);
`;

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
} = {
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
    title: 'Number',
    skeletonWidth: 80,
    Component: ({ data, config }) => {
      const url = getBlockLink(data.hash, config.coinTicker);
      if (url) {
        return <BlockLink href={url}>{data.number}</BlockLink>;
      }
      return <>{data.number}</>;
    },
  },
  type: {
    title: 'Type',
    skeletonWidth: 50,
    Component: ({ data }) => {
      switch (data.type) {
        case 'uncle':
          return <TypeUncle>{data.type}</TypeUncle>;
        case 'orphan':
          return <TypeOrphan>{data.type}</TypeOrphan>;
        default:
          return <TypeBlock>{data.type}</TypeBlock>;
      }
    },
  },
  date: {
    title: 'Date',
    skeletonWidth: 180,
    Component: ({ data }) => <Ws>{format(data.timestamp * 1000, 'PPp')}</Ws>,
  },
  region: {
    title: 'Region',
    skeletonWidth: 40,
    Component: ({ data }) => <Region>{data.region}</Region>,
  },
  miner: {
    title: 'Miner',
    skeletonWidth: 210,
    Component: ({ data, config }) => (
      <Mono>
        <Ws>
          <LinkMiner coin={config.coinTicker} address={data.miner} />
        </Ws>
      </Mono>
    ),
  },
  reward: {
    title: 'Reward',
    alignRight: true,
    skeletonWidth: 80,
    Component: ({ data }) => {
      const displayReward = useActiveCoinTickerDisplayValue(data.reward);

      return (
        <Mono>
          <Ws>{displayReward}</Ws>
        </Mono>
      );
    },
  },
  roundTime: {
    title: 'Round Time',
    skeletonWidth: 75,
    Component: ({ data }) => {
      return (
        <Ws>
          {dateUtils.durationWords(data.roundTime, {
            includeSeconds: true,
          })}
        </Ws>
      );
    },
  },
  luck: {
    title: 'Luck',
    skeletonWidth: 70,
    Component: ({ data }) => <Luck value={data.luck} />,
  },
  blockHash: {
    title: 'Hash',
    skeletonWidth: 200,
    alignRight: true,
    Component: ({ data, config }) => (
      <Mono>
        <Ws>
          <LinkOutCoin
            type="block"
            hash={data.hash}
            hashLength={10}
            coin={config.coinTicker}
          />
        </Ws>
      </Mono>
    ),
  },
};

export const BlocksSection: React.FC<{ address?: string }> = ({ address }) => {
  const blockState = useAsyncState<ApiBlocks>('blocks', {
    totalItems: 0,
    totalPages: 0,
    data: [],
  });
  const coinTicker = useActiveCoinTicker();
  const [currentPage, setCurrentPage] = React.useState(0);

  React.useEffect(() => {
    blockState.start(
      fetchApi(address ? '/miner/blocks' : '/pool/blocks', {
        query: { coin: coinTicker, page: currentPage, address },
      })
    );
  }, [currentPage, coinTicker, address]);

  const totalPages = blockState.data?.totalPages || 0;

  const blocks = React.useMemo(() => {
    return blockState.data?.data || [];
  }, [blockState.data]);

  const columns = React.useMemo(() => {
    // if no address, displaying default view
    if (!address) {
      return [
        blockCols.number,
        blockCols.type,
        blockCols.date,
        blockCols.region,
        blockCols.miner,
        blockCols.reward,
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
      blockCols.reward,
      blockCols.blockHash,
    ];
  }, [address]);

  const title = address
    ? blockState.data && blockState.data.totalItems > 1
      ? `You have mined ${blockState.data.totalItems} blocks.`
      : "You haven't mined any block yet."
    : null;

  return (
    <>
      {title && <h2>{title}</h2>}
      <DynamicList
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
      />
    </>
  );
};

import React from 'react';
import DynamicList from 'src/components/layout/List/List';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { useReduxState } from 'src/rdx/useReduxState';
import { fetchApi } from 'src/utils/fetchApi';
import format from 'date-fns/format';
import { useActiveCoinTickerDisplayValue } from 'src/hooks/useDisplayReward';
import { LinkMiner } from 'src/components/LinkMiner';
import { Luck } from 'src/components/Luck';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { getBlockLink } from 'src/utils/blockLink.utils';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { LinkOut } from 'src/components/LinkOut';
import { Ws } from 'src/components/Typo/Typo';
import { ListPagination } from 'src/components/layout/List/ListPagination';
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

export const BlocksSection = () => {
  const blockState = useAsyncState<ApiBlocks>('blocks', {
    totalItems: 0,
    totalPages: 0,
    data: [],
  });
  const localSettingsState = useReduxState('localSettings');
  const coinTicker = useActiveCoinTicker();
  const [currentPage, setCurrentPage] = React.useState(0);

  React.useEffect(() => {
    blockState.start(
      fetchApi('/pool/blocks', {
        query: { coin: coinTicker, page: currentPage },
      })
    );
  }, [currentPage, coinTicker]);

  const totalPages = blockState.data?.totalPages || 0;

  const blocks = React.useMemo(() => {
    return blockState.data?.data || [];
  }, [blockState.data]);

  return (
    <div>
      <DynamicList
        pagination={{
          currentPage,
          setCurrentPage,
          totalPages,
        }}
        isLoading={blockState.isLoading}
        loadingRowsCount={10}
        data={blocks}
        columns={[
          {
            title: 'Number',
            skeletonWidth: 80,
            Component: ({ data }) => {
              const url = getBlockLink(data.hash, coinTicker);
              if (url) {
                return <BlockLink href={url}>{data.number}</BlockLink>;
              }
              return <>{data.number}</>;
            },
          },
          {
            title: 'Type',
            skeletonWidth: 50,
            Component: ({ data }) =>
              data.type === 'uncle' ? (
                <TypeUncle>{data.type}</TypeUncle>
              ) : (
                <TypeBlock>{data.type}</TypeBlock>
              ),
          },
          {
            title: 'Date',
            skeletonWidth: 180,
            Component: ({ data }) => (
              <Ws>{format(data.timestamp * 1000, 'PPp')}</Ws>
            ),
          },
          {
            title: 'Region',
            skeletonWidth: 40,
            Component: ({ data }) => <Region>{data.region}</Region>,
          },
          {
            title: 'Miner',
            skeletonWidth: 210,
            Component: ({ data }) => (
              <LinkMiner coin={localSettingsState.coin} address={data.miner} />
            ),
          },
          {
            title: 'Reward',
            skeletonWidth: 80,
            Component: ({ data }) => {
              const displayReward = useActiveCoinTickerDisplayValue(
                data.reward
              );

              return <Ws>{displayReward}</Ws>;
            },
          },
          {
            title: 'Round Time',
            skeletonWidth: 75,
            Component: ({ data }) => {
              return <>{dateUtils.durationWords(data.roundTime)}</>;
            },
          },
          {
            title: 'Luck',
            skeletonWidth: 70,
            Component: ({ data }) => <Luck value={data.luck} />,
          },
        ]}
      />
    </div>
  );
};

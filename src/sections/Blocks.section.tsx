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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const PaginationItems = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin: 0 0.25rem;
  }

  @media screen and (max-width: 660px) {
    display: none;
  }
`;

const PaginSplit = styled.span`
  opacity: 0.3;
`;

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageSelect: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ currentPage, totalPages, onPageSelect }) => {
  const showStart = currentPage - 1 > 0;
  const showEnd = currentPage + 2 < totalPages;

  const pageList = [
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ]
    .filter((item) => item >= 0 && item < totalPages)
    .slice(0, 3);
  return (
    <PaginationItems>
      {showStart && (
        <>
          <Button size="sm" onClick={onPageSelect} value={0}>
            {1}
          </Button>
          <PaginSplit>—</PaginSplit>
        </>
      )}
      {pageList.map((item) => (
        <Button
          variant={currentPage === item ? 'primary' : undefined}
          key={item}
          size="sm"
          onClick={onPageSelect}
          value={item}
        >
          {item + 1}
        </Button>
      ))}
      {showEnd && (
        <>
          <PaginSplit>—</PaginSplit>
          <Button size="sm" onClick={onPageSelect} value={totalPages - 1}>
            {totalPages}
          </Button>
        </>
      )}
    </PaginationItems>
  );
};

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

  const handleChangePage = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const nextPage = Number((e.target as HTMLButtonElement).value);
      if (
        totalPages &&
        typeof nextPage === 'number' &&
        nextPage >= 0 &&
        nextPage < totalPages
      ) {
        setCurrentPage(nextPage);
      }
    },
    [totalPages]
  );

  return (
    <div>
      <DynamicList
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
              return (
                <>
                  {format(data.roundTime * 1000 - 1000 * 60 * 60, 'HH:mm:ss')}
                </>
              );
            },
          },
          {
            title: 'Luck',
            skeletonWidth: 70,
            Component: ({ data }) => <Luck value={data.luck} />,
          },
        ]}
      />
      <PaginationContainer>
        <Button
          disabled={currentPage === 0}
          size="sm"
          onClick={handleChangePage}
          value={currentPage - 1}
        >
          Prev
        </Button>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 0}
          onPageSelect={handleChangePage}
        />
        <Button
          disabled={currentPage >= totalPages - 1}
          size="sm"
          onClick={handleChangePage}
          value={currentPage + 1}
        >
          Next
        </Button>
      </PaginationContainer>
    </div>
  );
};

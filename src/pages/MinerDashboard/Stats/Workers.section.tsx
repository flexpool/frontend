import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { minerWorkersGet } from 'src/rdx/minerWorkers/minerWorkers.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiMinerWorker } from 'src/types/Miner.types';
import { dateUtils } from 'src/utils/date.utils';
import { formatSi } from 'src/utils/si.utils';
import styled from 'styled-components/macro';
import { FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PercentageItem = styled.span`
  color: var(--text-tertiary);
`;
const Percentage: React.FC<{ total: number; value: number }> = ({
  total,
  value,
}) => (
  <PercentageItem>
    ({Math.round((value / total) * 100 * 10) / 10}%)
  </PercentageItem>
);

const WorkerName = styled(Link)<{ offline?: boolean }>`
  color: var(--text-primary);
  &:hover {
    color: var(--primary);
  }
  ${(p) => p.offline && `color: var(--danger) !important;`};
  font-weight: 700;
`;

const SearchInput = styled.input`
  height: 30px;
  width: 200px;
  border: none;
  border-bottom: 1.8px solid black;
  font-size: 15px;
  font-weight: 500;
  padding-bottom: 0.2px;
  border-radius: 0px;
  outline: none;
  padding-left: 1.5rem;
  display: block;

  &:focus {
    padding-bottom: 0px;
    border-color: var(--primary);
  }
`;

const SearchBox = styled.div`
  display: flex;
  position: relative;
  margin-left: 1rem;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const ListHeader = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 1rem;
  margin-top: 2rem;
`;

type MinerWorker = ApiMinerWorker & { totalShares: number };

const columns: DynamicListColumn<ApiMinerWorker & { totalShares: number }>[] = [
  {
    title: 'Name',
    onClickValue: 'name',
    Component: ({ data }) => (
      <WorkerName
        to={{ search: `?worker=${data.name}` }}
        offline={!data.isOnline}
      >
        {data.name}
      </WorkerName>
    ),
  },
  {
    title: 'Reported Hashrate',
    alignRight: true,
    onClickValue: 'reportedHashrate',
    Component: ({ data }) => (
      <Mono>{formatSi(data.reportedHashrate, 'H/s')}</Mono>
    ),
  },
  {
    title: 'Current E. Hashrate',
    alignRight: true,
    onClickValue: 'currentEffectiveHashrate',
    Component: ({ data }) => (
      <Mono>{formatSi(data.currentEffectiveHashrate, 'H/s')}</Mono>
    ),
  },
  {
    title: 'Valid Shares',
    alignRight: true,
    onClickValue: 'validShares',
    Component: ({ data }) => (
      <Ws>
        <Mono>
          {data.validShares}{' '}
          <Percentage total={data.totalShares} value={data.validShares} />
        </Mono>
      </Ws>
    ),
  },
  {
    title: 'Stale Shares',
    alignRight: true,
    onClickValue: 'staleShares',
    Component: ({ data }) => (
      <Mono>
        {data.staleShares}{' '}
        <Percentage total={data.totalShares} value={data.staleShares} />
      </Mono>
    ),
  },
  {
    title: 'Invalid Shares',
    alignRight: true,
    onClickValue: 'invalidShares',
    Component: ({ data }) => (
      <Mono>
        {data.invalidShares}{' '}
        <Percentage total={data.totalShares} value={data.invalidShares} />
      </Mono>
    ),
  },
  {
    title: 'Last Seen',
    alignRight: true,
    Component: ({ data }) => (
      <Ws>{dateUtils.formatDistance(data.lastSeen * 1000)}</Ws>
    ),
  },
];

const MinerWorkersTable: React.FC<{
  data: MinerWorker[];
  isLoading: boolean;
  title: React.ReactNode;
  hideIfEmpty?: boolean;
}> = ({ data: unfilteredData, isLoading, title, hideIfEmpty }) => {
  const [sortKey, setSortKey] = React.useState<keyof ApiMinerWorker>('name');
  const [sortOrder, setSortOrder] = React.useState<-1 | 1>(1);
  const [search, setSearch] = React.useState('');

  const data = React.useMemo(() => {
    let res = unfilteredData;
    if (sortKey) {
      res = res.sort((a, b) => {
        try {
          if (typeof a[sortKey] === 'string') {
            return `${a[sortKey]}`.localeCompare(`${b[sortKey]}`) * sortOrder;
          }
          return (Number(a[sortKey]) - Number(b[sortKey])) * sortOrder;
        } catch {
          return 0;
        }
      });
    }
    if (search) {
      res = res.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return res;
  }, [unfilteredData, sortKey, search, sortOrder]);

  const handleColClick = React.useCallback(
    (value: string) => {
      setSortKey(value as keyof ApiMinerWorker);
      if (sortKey === value) {
        setSortOrder(sortOrder === -1 ? 1 : -1);
      }
    },
    [sortKey, sortOrder]
  );

  const cols = React.useMemo(() => {
    return columns.map((item) => {
      const Icon =
        item.onClickValue !== sortKey
          ? FaSort
          : sortOrder === 1
          ? FaSortUp
          : FaSortDown;
      return {
        ...item,
        title: (
          <>
            {item.title} <Icon />
          </>
        ),
      };
    });
  }, [sortKey, sortOrder]);

  const onSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setSearch(event.target.value),
    []
  );

  if (hideIfEmpty && unfilteredData.length < 1) {
    return null;
  }

  return (
    <div>
      <ListHeader>
        <h2>
          {title} ({unfilteredData.length})
        </h2>
        <SearchBox>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Filter by worker name"
            value={search}
            onChange={onSearchChange}
          />
        </SearchBox>
      </ListHeader>

      <DynamicList
        isLoading={isLoading}
        onColumnHeaderClick={handleColClick}
        data={data}
        columns={cols}
      />
    </div>
  );
};

export const MinerWorkers: React.FC<{
  address: string;
}> = ({ address }) => {
  const d = useDispatch();
  const coinTicker = useActiveCoinTicker();

  const minerWorkersState = useReduxState('minerWorkers');

  React.useEffect(() => {
    d(minerWorkersGet(coinTicker, address));
  }, [coinTicker, address, d]);

  const dataWithTotalShare = React.useMemo(() => {
    return minerWorkersState.data.map((item) => ({
      ...item,
      totalShares: item.invalidShares + item.staleShares + item.validShares,
    }));
  }, [minerWorkersState.data]);

  const activeWorkersData = React.useMemo(() => {
    return dataWithTotalShare.filter((item) => item.isOnline);
  }, [dataWithTotalShare]);

  const offlineWorkersData = React.useMemo(() => {
    return dataWithTotalShare.filter((item) => !item.isOnline);
  }, [dataWithTotalShare]);

  return (
    <div>
      <MinerWorkersTable
        hideIfEmpty
        isLoading={minerWorkersState.isLoading}
        data={offlineWorkersData}
        title="Offline workers"
      />
      <MinerWorkersTable
        isLoading={minerWorkersState.isLoading}
        data={activeWorkersData}
        title="Active workers"
      />
    </div>
  );
};

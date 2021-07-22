import React from 'react';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiMinerWorker } from 'src/types/Miner.types';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import {
  useLocalizedNumberFormatter,
  useLocalizedPercentFormatter,
  useLocalizedSiFormatter,
} from 'src/utils/si.utils';
import styled from 'styled-components';
import {
  FaSearch,
  FaSort,
  FaSortDown,
  FaSortUp,
  FaTimes,
} from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';

const PercentageItem = styled.span`
  color: var(--text-tertiary);
`;
const Percentage: React.FC<{ total: number; value: number }> = ({
  total,
  value,
}) => {
  const percentFormatter = useLocalizedPercentFormatter();
  if (total === 0) {
    return null;
  }
  return <PercentageItem>({percentFormatter(value / total)})</PercentageItem>;
};

const WorkerName = styled.span`
  color: var(--text-primary);
  white-space: nowrap;
  &:hover {
    color: var(--primary);
  }
  font-weight: 700;
`;

const WorkerNameOffline = styled(WorkerName)`
  color: var(--danger) !important;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  transition: 0.2s all;
  color: var(--text-secondary);
`;
const SearchInput = styled.input`
  height: 30px;
  width: 230px;
  border: none;
  border-bottom: 1.8px solid black;
  font-size: 15px;
  font-weight: 500;
  padding-bottom: 0.2px;
  border-radius: 0px;
  outline: none;
  padding-left: 1.5rem;
  display: block;
  background: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
  transition: 0.2s all;

  &:hover,
  &:focus {
    border-color: var(--primary);
    & + ${SearchIcon} {
      color: var(--text-primary);
    }
  }
`;

const SearchBox = styled.div`
  display: flex;
  position: relative;
  margin-left: 1rem;
`;

const ClearButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 100%;
  outline: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  height: 32px;
  width: 32px;
  background: transparent;
  opacity: 0.5;
  transition: 0.1s all;
  border-radius: 6px;
  &:hover,
  &:focus {
    opacity: 1;
  }
  &:hover {
    background: rgba(128, 128, 128, 0.08);
  }
  &:focus {
    background: rgba(128, 128, 128, 0.12);
  }
`;

const ListHeader = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 1rem;
  margin-top: 2rem;
`;

type MinerWorker = ApiMinerWorker & { totalShares: number };

const MinerWorkersTable: React.FC<{
  data: MinerWorker[];
  isLoading: boolean;
  title: React.ReactNode;
  hideIfEmpty?: boolean;
}> = ({ data: unfilteredData, isLoading, title, hideIfEmpty }) => {
  const [sortKey, setSortKey] = React.useState<keyof ApiMinerWorker>('name');
  const [sortOrder, setSortOrder] = React.useState<-1 | 1>(1);
  const [search, setSearch] = React.useState('');
  const { push } = useHistory();
  const siFormatter = useLocalizedSiFormatter();
  const { t } = useTranslation('dashboard');
  const numberFormatter = useLocalizedNumberFormatter();
  const dateFormatter = useLocalizedDateFormatter();
  const activeCoin = useActiveCoin();

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

  const uniqueHashrateValues = data
    .map((item) => item.reportedHashrate)
    .filter((value, index, self) => self.indexOf(value) === index);

  const hasReportedHashrate = uniqueHashrateValues.reduce(
    (total, next) => next + total,
    0
  );

  const handleColClick = React.useCallback(
    (value: string) => {
      setSortKey(value as keyof ApiMinerWorker);
      if (sortKey === value) {
        setSortOrder(sortOrder === -1 ? 1 : -1);
      }
    },
    [sortKey, sortOrder]
  );

  const onRowClick = React.useCallback(
    (data: ApiMinerWorker) => {
      push({ search: `?worker=${data.name}` });
    },
    [push]
  );

  const cols = React.useMemo(() => {
    const columns: DynamicListColumn<
      ApiMinerWorker & { totalShares: number }
    >[] = [
      {
        title: t('stats.table.table_head.name'),
        onClickValue: 'name',
        Component: React.memo(({ data }) =>
          data.isOnline ? (
            <WorkerName className="row-highlight">{data.name}</WorkerName>
          ) : (
            <WorkerNameOffline>{data.name}</WorkerNameOffline>
          )
        ),
      },
      ...(hasReportedHashrate
        ? [
            {
              title: t('stats.table.table_head.reported_hashrate'),
              alignRight: true,
              onClickValue: 'reportedHashrate',
              Component: React.memo(({ data }: { data: ApiMinerWorker }) => (
                <Ws>
                  <Mono>
                    {siFormatter(data.reportedHashrate, {
                      unit: activeCoin?.hashrateUnit,
                    })}{' '}
                    <Tooltip>
                      <TooltipContent>
                        {t('stats.table.table_head.average_e_hashrate')}: <br />
                        {siFormatter(data.averageEffectiveHashrate, {
                          unit: activeCoin?.hashrateUnit,
                        })}{' '}
                        <Percentage
                          total={data.reportedHashrate}
                          value={data.averageEffectiveHashrate}
                        />
                      </TooltipContent>
                    </Tooltip>
                  </Mono>
                </Ws>
              )),
            },
          ]
        : [
            {
              title: t(
                activeCoin?.hashrateUnit === 'B'
                  ? 'stats.table.table_head.average_e_space'
                  : 'stats.table.table_head.average_e_hashrate'
              ),
              alignRight: true,
              onClickValue: 'averageEffectiveHashrate',
              Component: React.memo(({ data }: { data: ApiMinerWorker }) => (
                <Ws>
                  <Mono>
                    {siFormatter(data.averageEffectiveHashrate, {
                      unit: activeCoin?.hashrateUnit,
                    })}{' '}
                  </Mono>
                </Ws>
              )),
            },
          ]),
      {
        title: t(
          activeCoin?.hashrateUnit === 'B'
            ? 'stats.table.table_head.current_e_space'
            : 'stats.table.table_head.current_e_hashrate'
        ),
        alignRight: true,
        onClickValue: 'currentEffectiveHashrate',
        Component: React.memo(({ data }) => (
          <Mono>
            {siFormatter(data.currentEffectiveHashrate, {
              unit: activeCoin?.hashrateUnit,
            })}
          </Mono>
        )),
      },
      {
        title: t(
          String(activeCoin?.ticker) === 'xch'
            ? 'stats.table.table_head.valid_points'
            : 'stats.table.table_head.valid'
        ),
        alignRight: true,
        onClickValue: 'validShares',
        Component: React.memo(({ data }) => (
          <Ws>
            <Mono>
              {numberFormatter(data.validShares)}{' '}
              <Percentage total={data.totalShares} value={data.validShares} />
            </Mono>
          </Ws>
        )),
      },
      {
        title: t(
          String(activeCoin?.ticker) === 'xch'
            ? 'stats.table.table_head.stale_points'
            : 'stats.table.table_head.stale'
        ),
        alignRight: true,
        onClickValue: 'staleShares',
        Component: React.memo(({ data }) => (
          <Ws>
            <Mono>
              {numberFormatter(data.staleShares)}{' '}
              <Percentage total={data.totalShares} value={data.staleShares} />
            </Mono>
          </Ws>
        )),
      },
      {
        title: t(
          String(activeCoin?.ticker) === 'xch'
            ? 'stats.table.table_head.invalid_points'
            : 'stats.table.table_head.invalid'
        ),
        alignRight: true,
        onClickValue: 'invalidShares',
        Component: React.memo(({ data }) => (
          <Ws>
            <Mono>
              {numberFormatter(data.invalidShares)}{' '}
              <Percentage total={data.totalShares} value={data.invalidShares} />
            </Mono>
          </Ws>
        )),
      },
      {
        title: t('stats.table.table_head.last_seen'),
        Component: React.memo(({ data }) => (
          <Ws>{dateFormatter.distanceFromNow(data.lastSeen * 1000)}</Ws>
        )),
      },
    ];

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
            {item.title} {item.onClickValue && <Icon />}
          </>
        ),
      };
    });
  }, [
    sortKey,
    sortOrder,
    siFormatter,
    numberFormatter,
    t,
    dateFormatter,
    hasReportedHashrate,
    activeCoin,
  ]);

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
          <SearchInput
            type="text"
            placeholder="Filter by worker name"
            value={search}
            onChange={onSearchChange}
          />
          <SearchIcon />
          {search && (
            <ClearButton onClick={() => setSearch('')}>
              <FaTimes />
            </ClearButton>
          )}
        </SearchBox>
      </ListHeader>

      <DynamicList
        isLoading={isLoading}
        onColumnHeaderClick={handleColClick}
        data={data}
        columns={cols}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export const MinerWorkers: React.FC<{
  address: string;
}> = ({ address }) => {
  const { t } = useTranslation('dashboard');

  const minerWorkersState = useReduxState('minerWorkers');

  const dataWithTotalShare = React.useMemo(() => {
    return (minerWorkersState.data || []).map((item) => ({
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
        title={t('stats.table.title_inactive')}
      />
      <MinerWorkersTable
        isLoading={minerWorkersState.isLoading}
        data={activeWorkersData}
        title={t('stats.table.title_active')}
      />
    </div>
  );
};

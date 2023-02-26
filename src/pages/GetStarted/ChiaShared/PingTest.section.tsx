import React from 'react';
import { AnyAction } from 'redux';
import { useTranslation } from 'next-i18next';

import styled from 'styled-components';
import { w3cwebsocket } from 'websocket';
import { differenceInMilliseconds } from 'date-fns';
import { FaCheck } from 'react-icons/fa';

import DynamicList, {
  AdditionalContainer,
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { MineableCoinRegion } from '../mineableCoinList';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';
import { Highlight, Mono, Ws } from 'src/components/Typo/Typo';
import { CopyButton } from 'src/components/CopyButton';
import { Sticker } from 'src/components/Sticker';
import { Tooltip } from 'src/components/Tooltip';
import { Img } from 'src/components/Img';
import { useBoolState } from 'src/hooks/useBoolState';

import { useField } from 'formik';
import Stack from '@/components/Stack';
import { FiChevronDown } from 'react-icons/fi';
import useCheckUserRegion from '@/hooks/useCheckUserRegion';
import { Flag } from '@/components/Flag';

// const WarningIcon = styled(FaExclamationCircle)`
//   color: var(--danger);
//   margin-left: 0.5rem;
// `;

const ExtraCard = styled.div`
  background-color: rgb(128 128 128 / 5%);
  height: 50px;
  border-radius: 5px;
  margin: 22px 0 22px 23px;
  display: flex;
  align-items: center;
  padding: 20px;
  font-size: 14px;
`;

const testConnection = (region: string) => {
  const latencyPromise = new Promise<number>((resolve, reject) => {
    const latencyData: number[] = [];
    let startTime = new Date();
    const wsPingTestClient = new w3cwebsocket(
      `wss://ws-ping-${region === 'us' ? 'us-east' : region}.flexpool.io:28246`
    );

    const TEST_COUNT = 6;

    wsPingTestClient.onmessage = () => {
      latencyData.push(differenceInMilliseconds(new Date(), startTime));

      if (latencyData.length > TEST_COUNT) {
        wsPingTestClient.close();
        const latencies = latencyData.sort((a, b) => a - b);
        // remove fastes and slowest
        latencies.pop();
        latencies.shift();

        const sum = latencies.reduce((a, b) => a + b, 0);
        const avg = Math.round(sum / latencies.length || 0);

        resolve(avg);
      } else {
        startTime = new Date();
        wsPingTestClient.send('ping\n');
      }
    };

    wsPingTestClient.onopen = () => {
      startTime = new Date();
      wsPingTestClient.send('ping\n');
    };

    wsPingTestClient.onerror = () => {
      wsPingTestClient.close();
      reject({ message: `Connection error ${region}` });
    };
  });

  return latencyPromise;
};

const SelectButton = styled.button<{ selected?: boolean }>`
  height: 32px;
  width: 32px;
  border: none;
  border-radius: 50%;
  color: var(--text-tertiary);
  background: var(--bg-secondary);
  outline: none;
  transition: 0.2s all;
  border: 1px solid transparent;
  margin-left: 0.5rem;
  &:hover {
    color: var(--success);
    border-color: var(--success);
  }
  ${(p) =>
    p.selected &&
    `
    background: var(--success);
    color: var(--text-on-bg) !important;
  `}
`;

// const SelectButtonSecondary = styled(SelectButton)`
//   &:hover {
//     color: var(--warning);
//     border-color: var(--warning);
//   }
//   ${(p) =>
//     p.selected &&
//     `
//     background: var(--warning);
//     color: var(--text-on-bg) !important;
//   `}
// `;

const reducer = (state: { [key: string]: number }, action: AnyAction) => {
  switch (action.type) {
    case 'SET': {
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    }
    default:
      return state;
  }
};

export const PingTestSection = ({
  data,
  namePrimary,
}: {
  data: MineableCoinRegion[];
  namePrimary: string;
}) => {
  const isChinaRegion = useCheckUserRegion('zh');

  const [latencies, dispatch] = React.useReducer(reducer, {});

  const isAutoSetOnce = useBoolState();

  const [, { value: primaryServer }, { setValue: setPrimaryServer }] =
    useField(namePrimary);

  const { t } = useTranslation('get-started');

  const handleSetLowestLatency = React.useCallback(
    (name: string, value: number) => {
      dispatch({
        type: 'SET',
        payload: {
          name,
          value,
        },
      });
    },
    []
  );

  const cols: DynamicListColumn<
    MineableCoinRegion,
    {
      setLatency: (name: string, latency: number) => void;
      fastestServer: string | null;
      secondFastestServer: string | null;
      setServer: (type: 'secondary' | 'primary', domain: string) => void;
      searchParams: {
        primaryServer?: string;
        secondaryServer?: string;
        farmerOption?: string;
      };
    }
  >[] = React.useMemo(
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
                <span
                  style={{ color: 'var(--text-tertiary)', marginLeft: '15px' }}
                >
                  {(() => {
                    var split = data.code.split('-');
                    if (split.length === 1) return data.code.toUpperCase();
                    split[0] = split[0].toUpperCase();
                    split[1] =
                      split[1].charAt(0).toUpperCase() + split[1].slice(1);
                    return split.join('-');
                  })()}
                </span>
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
        title: t('detail.region.table_head.average_lat'),
        Component: ({
          data,
          config: { setLatency, fastestServer, secondFastestServer },
        }) => {
          const connectionState = useAsyncState<number>();
          const [isSet, setIsSet] = React.useState(false);
          React.useEffect(() => {
            connectionState.start(testConnection(data.code));
            // eslint-disable-next-line
          }, [data.domain]);

          const latency = connectionState.data;

          React.useEffect(() => {
            if (latency && !isSet) {
              setLatency(data.domain, latency);
              setIsSet(false);
            }
          }, [latency, setLatency, data.domain, isSet]);

          if (connectionState.isLoading) {
            return <LoaderSpinner size="xs" />;
          }

          return (
            <Ws>
              {latency ? `${latency} ms` : 'n/a'}{' '}
              {fastestServer === data.domain && (
                <>
                  &nbsp;
                  <Sticker variant="success">
                    {t('detail.region.fastest')}
                  </Sticker>
                </>
              )}
            </Ws>
          );
        },
      },
      {
        title: '',
        alignRight: true,
        Component: ({ data, config: { searchParams, setServer } }) => {
          const isPrimarySelected = searchParams.primaryServer === data.domain;

          return (
            <>
              <Tooltip
                wrapIcon={false}
                icon={
                  <SelectButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setServer('primary', data.domain);
                    }}
                    selected={isPrimarySelected}
                  >
                    {<FaCheck />}
                  </SelectButton>
                }
              >
                Set as primary connection
              </Tooltip>
            </>
          );
        },
      },
    ],
    [t]
  );

  /**
   * returns two fastest servers
   */
  const fastest = React.useMemo(() => {
    if (data.length > Object.keys(latencies).length) {
      return {
        first: null,
        second: null,
      };
    }

    const sorted = Object.entries(latencies).sort((a, b) => a[1] - b[1]);
    const result = {
      first: (sorted[0] && sorted[0][0]) || null,
      second: (sorted[1] && sorted[1][0]) || null,
    };

    return result;
  }, [latencies, data]);

  /**
   * Automatically set primary and secondary
   */
  React.useEffect(() => {
    if (fastest.first && !isAutoSetOnce.value) {
      isAutoSetOnce.handleTrue();
      setPrimaryServer(fastest.first);
    }
  }, [fastest, setPrimaryServer, isAutoSetOnce]);

  const setServer = React.useCallback(
    (type: 'secondary' | 'primary', domain: string) => {
      setPrimaryServer(domain);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const searchParams = {
    primaryServer,
  };

  const colConfig = {
    setLatency: handleSetLowestLatency,
    fastestServer: fastest.first,
    secondFastestServer: fastest.second,
    searchParams,
    setServer,
  };

  const selectItem = (d: MineableCoinRegion) => {
    setPrimaryServer(d.domain);
  };

  return (
    <>
      <DynamicList
        onRowClick={selectItem}
        config={colConfig}
        data={data}
        columns={cols}
        additionalRowRender={(item) => {
          if (item.domain === 'xch-sg.flexpool.io') {
            return (
              <AdditionalContainer>
                <div
                  style={{
                    color: 'var(--text-tertiary)',
                    fontSize: 12,
                    position: 'absolute',
                    padding: '0 10px',
                    top: '-6px',
                    left: '14px',
                  }}
                >
                  <Stack spacing="xs">
                    <FiChevronDown size={14} />{' '}
                    <span>{t('detail.more_about')} SG</span>
                  </Stack>
                </div>
                <ExtraCard>
                  <Flag countryCode="cn" shape="round" />
                  <span
                    style={{
                      color: isChinaRegion ? 'var(--warning)' : 'inherit',
                    }}
                  >
                    {t('detail.endpoint_china')}
                  </span>

                  <div
                    style={{
                      marginLeft: '74px',
                      cursor: 'text',
                      fontWeight: 600,
                    }}
                  >
                    sg.fpxch.xyz
                  </div>
                </ExtraCard>
              </AdditionalContainer>
            );
          }
        }}
      />
    </>
  );
};

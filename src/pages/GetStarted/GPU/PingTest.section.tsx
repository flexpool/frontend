import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { w3cwebsocket } from 'websocket';
import { differenceInMilliseconds } from 'date-fns';
import styled from 'styled-components';
import qs from 'query-string';
import { AnyAction } from 'redux';
import Link, { LinkProps } from 'next/link';
import DescriptionList from '@/components/DescriptionList';

// Components
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { MineableCoinRegion } from '../mineableCoinList';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';
import { Highlight, Mono, Ws } from 'src/components/Typo/Typo';
import { CopyButton } from 'src/components/CopyButton';
import { Sticker } from 'src/components/Sticker';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { Img } from 'src/components/Img';
import {
  FaCheck,
  FaEthernet,
  FaExclamationCircle,
  FaNetworkWired,
} from 'react-icons/fa';

import { useAsyncState } from 'src/hooks/useAsyncState';
import { useBoolState } from 'src/hooks/useBoolState';

const WarningIcon = styled(FaExclamationCircle)`
  color: var(--danger);
  margin-left: 0.5rem;
`;

const testConnection = (region: string) => {
  const latencyPromise = new Promise<number>((resolve, reject) => {
    const latencyData: number[] = [];
    let startTime = new Date();
    const wsPingTestClient = new w3cwebsocket(
      `wss://ws-ping-${region}.flexpool.io:28246`
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

const SelectButtonSecondary = styled(SelectButton)`
  &:hover {
    color: var(--warning);
    border-color: var(--warning);
  }
  ${(p) =>
    p.selected &&
    `
    background: var(--warning);
    color: var(--text-on-bg) !important;
  `}
`;

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

export const LinkText = (props: React.PropsWithChildren<LinkProps>) => {
  return (
    <Link {...props} href={props.href || ''}>
      <a>{props.children}</a>
    </Link>
  );
};

const WarningBox = styled.div`
  font-size: 0.8rem;
  border-radius: 8px;
  padding: 0.5rem;
  margin-left: -0.5rem;
  background-color: var(--warning);
  margin-top: 5px;
  max-width: 200px;
`;

export const PingTestSection: React.FC<{ data: MineableCoinRegion[] }> = ({
  data,
}) => {
  const { t } = useTranslation('get-started');
  const router = useRouter();
  const isAutoSetOnce = useBoolState();
  const [latencies, dispatch] = React.useReducer(reducer, {});
  const ticker = router.query.ticker;
  let search;

  if (typeof window !== 'undefined') {
    search = window.location.search;
  }

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
              {secondFastestServer === data.domain && (
                <>
                  &nbsp;
                  <Sticker variant="warning">
                    {t('detail.region.backup')}
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
          const isSecondarySelected =
            searchParams.secondaryServer === data.domain;

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
                    {isPrimarySelected ? <FaCheck /> : <FaEthernet />}
                  </SelectButton>
                }
              >
                Set as primary connection
              </Tooltip>
              &nbsp;
              <Tooltip
                wrapIcon={false}
                icon={
                  <SelectButtonSecondary
                    selected={isSecondarySelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      setServer('secondary', data.domain);
                    }}
                  >
                    {isSecondarySelected ? <FaCheck /> : <FaNetworkWired />}
                  </SelectButtonSecondary>
                }
              >
                Set as backup connection
              </Tooltip>
            </>
          );
        },
      },
    ],
    [t]
  );
  const [urlState, setUrlState] = useState(new Date());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', function (event) {
        setUrlState(new Date());
      });
    }
  }, []);

  /**
   * list of servers with 14444
   */
  const highDiffServers = React.useMemo(() => {
    return data
      .filter((item) => item.high_diff_avail)
      .map((item) => item.domain);
  }, [data]);

  const searchParams = React.useMemo(() => {
    return qs.parse(search) as {
      primaryServer?: string;
      secondaryServer?: string;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState]);

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
    if (fastest.first && fastest.second && !isAutoSetOnce.value) {
      isAutoSetOnce.handleTrue();
      const query = qs.stringify({
        ...searchParams,
        primaryServer: fastest.first,
        secondaryServer: fastest.second,
      });

      const newUrl = `${router.asPath.split('?')[0]}/?${query}`;

      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl
      );
      let queryStringChange = new Event('popstate');
      window.dispatchEvent(queryStringChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fastest]);

  const setServer = React.useCallback(
    (type: 'secondary' | 'primary', domain: string) => {
      const isPrimarySelection = type === 'primary';
      // replaceNextRoute ('volume', volume.toString ())
      const query = qs.stringify({
        ...searchParams,
        ...(isPrimarySelection
          ? {
              primaryServer: domain,
            }
          : {
              secondaryServer: domain,
            }),
      });

      const newUrl = `${router.asPath.split('?')[0]}/?${query}`;

      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl
      );

      let queryStringChange = new Event('popstate');
      window.dispatchEvent(queryStringChange);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  const colConfig = React.useMemo(() => {
    return {
      setLatency: handleSetLowestLatency,
      fastestServer: fastest.first,
      secondFastestServer: fastest.second,
      searchParams,
      setServer,
    };
  }, [handleSetLowestLatency, fastest, searchParams, setServer]);

  const selectItem = React.useCallback(
    (d: MineableCoinRegion) => {
      const query = qs.stringify({
        ...searchParams,
        primaryServer: d.domain,
      });

      const newUrl = `${router.asPath.split('?')[0]}/?${query}`;

      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl
      );

      let queryStringChange = new Event('popstate');
      window.dispatchEvent(queryStringChange);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  return (
    <>
      <h2>
        <Highlight>#2</Highlight> {t('detail.region.title')}
      </h2>
      <p className="mb-2">{t('detail.region.description')}</p>
      <DynamicList
        onRowClick={selectItem}
        config={colConfig}
        data={data}
        columns={cols}
        additionalRowRender={(item) => {
          if (item.domain === 'eth-hke.flexpool.io') {
            return (
              <DescriptionList
                items={[
                  {
                    term: (
                      <span style={{ fontSize: '0.85rem' }}>
                        {t('regions.additional_ports')}
                      </span>
                    ),
                    description: (
                      <div style={{ fontSize: '0.85rem' }}>
                        <div>
                          TCP: <Sticker>13271</Sticker>
                        </div>
                        <div style={{ marginTop: '0.25rem' }}>
                          SSL: <Sticker>22271</Sticker>
                        </div>
                      </div>
                    ),
                  },
                  {
                    term: (
                      <span style={{ fontSize: '0.85rem' }}>
                        {t('regions.additional_domains')}
                      </span>
                    ),

                    description: (
                      <span style={{ fontSize: '0.85rem' }}>
                        hke.fpmirror.com
                      </span>
                    ),
                  },
                ]}
              />
            );
          }
          return null;
        }}
      />
      <h3>{t('detail.ports.title')}</h3>
      <p className="mb-2">
        <Trans
          ns="get-started"
          i18nKey="detail.ports.description"
          components={{
            more: <LinkText href="/faq#should-i-use-ssl" />,
            // strong: <strong />,
          }}
        />
      </p>
      <div>
        <table style={{ width: 'auto' }}>
          <tbody>
            <tr>
              <td>
                <strong>{t('detail.ports.ssl_port')}</strong>
              </td>
              <td>
                <Sticker variant="success">5555</Sticker>
              </td>
            </tr>
            <tr>
              <td>{t('detail.ports.tcp_port')}</td>
              <td>
                <Sticker>4444</Sticker>
                <Tooltip icon={<WarningIcon />}>
                  <TooltipContent>
                    <p>
                      <Trans
                        ns="get-started"
                        i18nKey="detail.ports.tcp_port_tooltip"
                        components={{
                          more: <LinkText href="/faq#should-i-use-ssl" />,
                          strong: <strong />,
                        }}
                      />
                    </p>
                  </TooltipContent>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td>{t('detail.ports.high_diff_port')}</td>
              <td>
                <Sticker>14444</Sticker>{' '}
                <Tooltip>
                  <TooltipContent>
                    <p>
                      <Trans
                        ns="get-started"
                        i18nKey="detail.ports.high_diff_port_tooltip"
                        components={{
                          NiceHash: (
                            <LinkText
                              href={
                                ticker
                                  ? `/get-started/${ticker}/nicehash`
                                  : 'nicehash'
                              }
                            />
                          ),
                        }}
                      />
                    </p>
                    <ul>
                      {highDiffServers.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

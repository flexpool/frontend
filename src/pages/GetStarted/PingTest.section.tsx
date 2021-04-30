import React from 'react';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { MineableCoinRegion } from './mineableCoinList';
import { w3cwebsocket } from 'websocket';
import { differenceInMilliseconds } from 'date-fns';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';
import qs from 'query-string';
import { useHistory, useLocation } from 'react-router';
import { FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { Highlight, Mono, Ws } from 'src/components/Typo/Typo';
import { CopyButton } from 'src/components/CopyButton';
import styled from 'styled-components';
import { Sticker } from 'src/components/Sticker';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { Img } from 'src/components/Img';
import { Trans, useTranslation } from 'react-i18next';

const WarningIcon = styled(FaExclamationCircle)`
  color: var(--danger);
  margin-left: 0.5rem;
`;

const testConnection = (domain: string) => {
  const latencyPromise = new Promise<number>((resolve, reject) => {
    const latencyData: number[] = [];
    let startTime = new Date();
    const wsPingTestClient = new w3cwebsocket(`wss://${domain}:28246`);

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
      reject({ message: `Connection error ${domain}` });
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
  &:hover {
    color: var(--primary);
    border-color: var(--primary);
  }
  ${(p) =>
    p.selected &&
    `
    background: var(--primary);
    color: var(--text-on-bg) !important;
  `}
`;

export const PingTestSection: React.FC<{ data: MineableCoinRegion[] }> = ({
  data,
}) => {
  const [lowestLatency, setLowestLatency] = React.useState<number>(10000);
  const { t } = useTranslation('get-started');

  const handleSetLowestLatency = React.useCallback(
    (l: number) => {
      if (lowestLatency > l) {
        setLowestLatency(l);
      }
    },
    [lowestLatency]
  );

  const cols: DynamicListColumn<
    MineableCoinRegion,
    {
      setLowestLatency: (latency: number) => void;
      lowestLatency: number;
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
        Component: ({ data, config: { setLowestLatency, lowestLatency } }) => {
          const connectionState = useAsyncState<number>();
          React.useEffect(() => {
            connectionState.start(testConnection(data.domain));
            // eslint-disable-next-line
          }, [data.domain]);

          const latency = connectionState.data;

          React.useEffect(() => {
            if (latency) {
              setLowestLatency(latency);
            }
          }, [latency, setLowestLatency]);

          if (connectionState.isLoading) {
            return <LoaderSpinner size="xs" />;
          }

          return (
            <Ws>
              {latency ? `${latency} ms` : 'n/a'}{' '}
              {latency === lowestLatency && (
                <>
                  &nbsp;
                  <Sticker variant="success">Fastest</Sticker>
                </>
              )}
            </Ws>
          );
        },
      },
      {
        title: '',
        alignRight: true,
        Component: ({ data }) => {
          const { search } = useLocation();
          const history = useHistory();
          const searchParams = qs.parse(search);
          const isSelected = searchParams.selectedServer === data.domain;

          const handleClick = React.useCallback(() => {
            const searchP = qs.parse(search);
            history.replace({
              search: qs.stringify({
                ...searchP,
                selectedServer: data.domain,
              }),
            });
          }, [search, history, data.domain]);

          return (
            <SelectButton onClick={handleClick} selected={isSelected}>
              <FaCheck />
            </SelectButton>
          );
        },
      },
    ],
    [t]
  );

  return (
    <>
      <h2>
        <Highlight>#2</Highlight> {t('detail.region.title')}
      </h2>
      <p>{t('detail.region.description')}</p>
      <DynamicList
        config={{ setLowestLatency: handleSetLowestLatency, lowestLatency }}
        data={data}
        columns={cols}
      />
      <h3>{t('detail.ports.title')}</h3>
      <p>
        <Trans
          ns="get-started"
          i18nKey="detail.ports.description"
          components={{
            more: <Link to="/faq#should-i-use-ssl" />,
            strong: <strong />,
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
                          more: <Link to="/faq#should-i-use-ssl" />,
                          strong: <strong />,
                        }}
                      />
                    </p>
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

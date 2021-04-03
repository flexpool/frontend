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
import { Button } from 'src/components/Button';
import { FaCheck } from 'react-icons/fa';
import { Highlight } from 'src/components/Typo/Typo';

const testConnection = (domain: string) => {
  const latencyPromise = new Promise<number>((resolve, reject) => {
    const latencyData: number[] = [];
    let startTime = new Date();
    const wsPingTestClient = new w3cwebsocket(`ws://${domain}:28246`);

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
      reject({ message: 'Connection error' });
    };
  });

  return latencyPromise;
};

const cols: DynamicListColumn<MineableCoinRegion>[] = [
  {
    title: 'Server location',
    Component: ({ data }) => <>{data.title}</>,
  },
  {
    title: 'Domain',
    Component: ({ data }) => <>{data.domain}</>,
  },
  {
    title: 'Average Latency',
    Component: ({ data }) => {
      const connectionState = useAsyncState();
      React.useEffect(() => {
        connectionState.start(testConnection(data.domain));
      }, []);

      const latency = connectionState.data;

      if (connectionState.isLoading) {
        return <LoaderSpinner size="xs" />;
      }

      return <div>{latency ? `${latency} ms` : 'n/a'}</div>;
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
      }, [search]);

      return isSelected ? (
        <Button size="sm" variant="primary">
          <FaCheck />
        </Button>
      ) : (
        <Button onClick={handleClick} size="sm">
          <FaCheck />
        </Button>
      );
    },
  },
];

export const PingTest: React.FC<{ data: MineableCoinRegion[] }> = ({
  data,
}) => {
  return (
    <>
      <h2>
        <Highlight>#2</Highlight> Select your server
      </h2>
      <p>
        For the best performance, you should choose server with lowest latency
        to your mining rig or computer. The chart is displaying latency between
        servers and this device.
      </p>
      <DynamicList data={data} columns={cols} />
    </>
  );
};

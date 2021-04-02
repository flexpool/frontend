import React from 'react';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { MineableCoinRegion } from './mineableCoinList';
import { w3cwebsocket } from 'websocket';
import { differenceInMilliseconds } from 'date-fns';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';

const testConnection = (domain: string) => {
  const latencyPromise = new Promise<number>((resolve, reject) => {
    const latencyData: number[] = [];
    let startTime = new Date();
    const wsPingTestClient = new w3cwebsocket(`ws://${domain}:28246`);

    const TEST_COUNT = 10;

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
];

export const PingTest: React.FC<{ data: MineableCoinRegion[] }> = ({
  data,
}) => {
  return <DynamicList data={data} columns={cols} />;
};

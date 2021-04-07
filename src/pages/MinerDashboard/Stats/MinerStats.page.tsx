import React from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { Card } from 'src/components/layout/Card';
import { Spacer } from 'src/components/layout/Spacer';
import { useActiveSearchParamWorker } from 'src/hooks/useActiveQueryWorker';
import StatsChart from './MinerStats.chart';
import { MinerStats } from './Stats.section';
import { MinerWorkers } from './Workers.section';
import styled from 'styled-components/macro';
import { Button } from 'src/components/Button';
import qs from 'query-string';
const WorkerTitle = styled.div`
  text-transform: uppercase;
  font-weight: 600;
`;
const Worker = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  margin-top: 0.5rem;
`;

const WorkerCard = styled(Card)`
  background: var(--primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MinerStatsPage = () => {
  const {
    params: { address, coin },
  } = useRouteMatch<{ address: string; coin: string }>();
  const worker = useActiveSearchParamWorker();
  const history = useHistory();
  const location = useLocation();

  React.useLayoutEffect(() => {
    if (worker) {
      setTimeout(() => {
        const scrollToEl = document.getElementById('workertabs');
        if (scrollToEl) {
          window.scrollTo({
            top: scrollToEl.getBoundingClientRect().top - 100 + window.scrollY,
            left: 0,
            behavior: 'smooth',
          });
        }
      }, 50);
    }
  }, [worker]);

  const handleResetActiveWorker = React.useCallback(() => {
    // just remove the worker
    const { worker, ...restQuery } = qs.parse(location.search);

    history.push({
      search: qs.stringify(restQuery),
    });
  }, [location.search, history]);

  return (
    <>
      {worker && (
        <>
          <WorkerCard padding>
            <div>
              <WorkerTitle>Worker</WorkerTitle>
              <Worker>{worker}</Worker>
            </div>
            <div>
              <Button onClick={handleResetActiveWorker} size="sm">
                Reset
              </Button>
            </div>
          </WorkerCard>
          <Spacer />
        </>
      )}
      <MinerStats />
      <Spacer />
      <StatsChart address={address} coinTicker={coin} />
      <MinerWorkers address={address} />
    </>
  );
};

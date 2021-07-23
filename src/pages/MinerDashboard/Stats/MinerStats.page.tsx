import React from 'react';
import { useRouter } from 'next/router';
// import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { Card } from 'src/components/layout/Card';
import { Spacer } from 'src/components/layout/Spacer';
import { useActiveSearchParamWorker } from 'src/hooks/useActiveQueryWorker';
import StatsChart from './MinerStats.chart';
import { MinerStats } from './Stats.section';
import { MinerWorkers } from './Workers.section';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import qs from 'query-string';
import { AverageEffectivePeriods } from './minerStats.types';
import { useTranslation } from 'next-i18next';

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
  color: var(--text-on-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MinerStatsPage: React.FC<{
  address: string;
  coin: string;
}> = ({ address, coin }) => {
  const router = useRouter();

  // const {
  //   params: { address, coin },
  // } = useRouteMatch<{ address: string; coin: string }>();
  const [
    averageEffectivePeriods,
    setAverageEffectivePeriods,
  ] = React.useState<AverageEffectivePeriods>({ 6: 0, 12: 0 });

  const worker = useActiveSearchParamWorker();
  // const history = useHistory();
  // const location = useLocation();
  const { t } = useTranslation('dashboard');

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
    const { worker, ...restQuery } = qs.parse(window.location.search);

    router.push({
      search: qs.stringify(restQuery),
    });
  }, []);

  return (
    <>
      {worker && (
        <>
          <WorkerCard padding>
            <div>
              <WorkerTitle>{t('stats.active_worker.title')}</WorkerTitle>
              <Worker>{worker}</Worker>
            </div>
            <div>
              <Button onClick={handleResetActiveWorker} size="sm">
                {t('stats.active_worker.reset')}
              </Button>
            </div>
          </WorkerCard>
          <Spacer />
        </>
      )}
      <MinerStats averageEffectivePeriods={averageEffectivePeriods} />
      <Spacer />
      <StatsChart
        setAverageEffectivePeriods={setAverageEffectivePeriods}
        address={address}
        coinTicker={coin}
      />
      {/* <MinerWorkers address={address} /> */}
    </>
  );
};

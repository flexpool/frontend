import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/components/layout/Card';
import { Spacer } from 'src/components/layout/Spacer';
import { useActiveSearchParamWorker } from 'src/hooks/useActiveQueryWorker';
import StatsChart from './MinerStats.chart';
import { MinerStats } from './Stats.section';
import { MinerWorkers } from './Workers.section';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { AverageEffectivePeriods } from './minerStats.types';
import { useTranslation } from 'next-i18next';
import ExitIcon from 'src/assets/exit-icon.svg';

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

  const [averageEffectivePeriods, setAverageEffectivePeriods] =
    React.useState<AverageEffectivePeriods>({ 6: 0, 12: 0 });

  const worker = useActiveSearchParamWorker();
  const { t } = useTranslation('dashboard');

  React.useLayoutEffect(() => {
    if (worker) {
      const scrollToEl = document.getElementById('workertabs');
      if (scrollToEl) {
        window.scrollTo({
          top: scrollToEl.getBoundingClientRect().top - 100 + window.scrollY,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [worker]);

  const handleResetActiveWorker = React.useCallback(() => {
    // just remove the worker
    // const { worker, ...restQuery } = qs.parse(window.location.search);
    router.push(
      `/miner/${router.query.coin}/${router.query.address}/`,
      undefined,
      {
        shallow: true,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <ExitIcon style={{ width: 20 }} />
              </Button>
            </div>
          </WorkerCard>
          <Spacer />
        </>
      )}
      <MinerStats
        coin={coin}
        address={address}
        worker={worker}
        averageEffectivePeriods={averageEffectivePeriods}
      />
      <Spacer />
      <StatsChart
        setAverageEffectivePeriods={setAverageEffectivePeriods}
        address={address}
        coinTicker={coin}
      />
      <MinerWorkers address={address} coin={coin} />
    </>
  );
};

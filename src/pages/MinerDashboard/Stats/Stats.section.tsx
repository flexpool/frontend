import { useTranslation } from 'react-i18next';
import { Card, CardTitle } from 'src/components/layout/Card';
import { StatItem } from 'src/components/StatItem';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useReduxState } from 'src/rdx/useReduxState';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import styled from 'styled-components';
import { AverageEffectivePeriods } from './minerStats.types';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';

const StatItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const getDisplayPercentage = (
  prefix: string,
  total?: number,
  value?: number
) => {
  const displayValue =
    total && typeof value === 'number'
      ? Math.round((value / total) * 100 * 100) / 100 || '0'
      : '-';
  return `${prefix} (${displayValue}%)`;
};

const AverageTooltipItem = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 1.4;
  strong {
    margin-left: 1rem;
  }
`;

export const MinerStats: React.FC<{
  averageEffectivePeriods: AverageEffectivePeriods;
}> = ({ averageEffectivePeriods }) => {
  const minerStatsState = useReduxState('minerStats');
  const data = minerStatsState.data;
  const totalShares =
    (data && data.invalidShares + data.staleShares + data.validShares) || 0;
  const siFormatter = useLocalizedSiFormatter();
  const { t } = useTranslation('dashboard');
  const activeCoin = useActiveCoin();

  return (
    <StatGrid>
      <Card padding>
        <CardTitle>
          {activeCoin?.hashrateUnit === 'B'
            ? t('stats.hashrate.title_space')
            : t('stats.hashrate.title')}
        </CardTitle>
        <StatItemGrid>
          <StatItem
            title={t('stats.hashrate.current')}
            value={siFormatter(data?.currentEffectiveHashrate, {
              unit: activeCoin?.hashrateUnit,
            })}
          />
          <Tooltip
            icon={
              <StatItem
                title={t('stats.hashrate.average')}
                value={siFormatter(data?.averageEffectiveHashrate, {
                  unit: activeCoin?.hashrateUnit,
                })}
              />
            }
            wrapIcon={false}
          >
            <TooltipContent>
              <AverageTooltipItem>
                12h Average:{' '}
                <strong>
                  {siFormatter(averageEffectivePeriods[12], {
                    unit: activeCoin?.hashrateUnit,
                  })}
                </strong>
              </AverageTooltipItem>
              <AverageTooltipItem>
                6h Average:{' '}
                <strong>
                  {siFormatter(averageEffectivePeriods[6], {
                    unit: activeCoin?.hashrateUnit,
                  })}
                </strong>
              </AverageTooltipItem>
            </TooltipContent>
          </Tooltip>
          <StatItem
            title={t('stats.hashrate.reported')}
            value={siFormatter(data?.reportedHashrate, {
              unit: activeCoin?.hashrateUnit,
            })}
          />
        </StatItemGrid>
      </Card>
      <Card padding>
        <CardTitle>
          {t(
            String(activeCoin?.ticker) === 'xch'
              ? 'stats.shares.title_points'
              : 'stats.shares.title'
          )}
        </CardTitle>
        <StatItemGrid>
          <StatItem
            title={getDisplayPercentage(
              t('stats.shares.valid'),
              totalShares,
              data?.validShares
            )}
            value={siFormatter(data?.validShares, { shortenAbove: 100000 })}
          />
          <StatItem
            title={getDisplayPercentage(
              t('stats.shares.stale'),
              totalShares,
              data?.staleShares
            )}
            value={siFormatter(data?.staleShares, { shortenAbove: 100000 })}
          />
          <StatItem
            title={getDisplayPercentage(
              t('stats.shares.invalid'),
              totalShares,
              data?.invalidShares
            )}
            value={siFormatter(data?.invalidShares, {
              shortenAbove: 100000,
            })}
          />
        </StatItemGrid>
      </Card>
    </StatGrid>
  );
};

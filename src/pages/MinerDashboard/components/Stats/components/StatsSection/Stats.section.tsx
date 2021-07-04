import { useTranslation } from 'react-i18next';
import { Card, CardTitle } from 'src/components/layout/Card';
import { StatItem } from 'src/components/StatItem';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useReduxState } from 'src/rdx/useReduxState';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import { AverageEffectivePeriods } from '../../minerStats.types';
import { StatItemGrid, StatGrid, AverageTooltipItem } from './components';

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

export const MinerStats: React.FC<{
  averageEffectivePeriods: AverageEffectivePeriods;
}> = ({ averageEffectivePeriods }) => {
  const minerStatsState = useReduxState('minerStats');
  const data = minerStatsState.data;
  const totalShares =
    (data && data.invalidShares + data.staleShares + data.validShares) || 0;
  const siFormatter = useLocalizedSiFormatter();
  const { t } = useTranslation('dashboard');

  return (
    <StatGrid>
      <Card padding>
        <CardTitle>{t('stats.hashrate.title')}</CardTitle>
        <StatItemGrid>
          <StatItem
            title={t('stats.hashrate.current')}
            value={siFormatter(data?.currentEffectiveHashrate, { unit: 'H/s' })}
          />
          <Tooltip
            icon={
              <StatItem
                title={t('stats.hashrate.average')}
                value={siFormatter(data?.averageEffectiveHashrate, {
                  unit: 'H/s',
                })}
              />
            }
            wrapIcon={false}
          >
            <TooltipContent>
              <AverageTooltipItem>
                12h Average:{' '}
                <strong>
                  {siFormatter(averageEffectivePeriods[12], { unit: 'H/s' })}
                </strong>
              </AverageTooltipItem>
              <AverageTooltipItem>
                6h Average:{' '}
                <strong>
                  {siFormatter(averageEffectivePeriods[6], { unit: 'H/s' })}
                </strong>
              </AverageTooltipItem>
            </TooltipContent>
          </Tooltip>
          <StatItem
            title={t('stats.hashrate.reported')}
            value={siFormatter(data?.reportedHashrate, { unit: 'H/s' })}
          />
        </StatItemGrid>
      </Card>
      <Card padding>
        <CardTitle>{t('stats.shares.title')}</CardTitle>
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

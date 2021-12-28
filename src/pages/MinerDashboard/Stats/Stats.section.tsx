import { useTranslation } from 'next-i18next';
import { isAfter, subHours } from 'date-fns';
import styled from 'styled-components';
import { Card, CardTitle } from '@/components/layout/Card';
import { StatItem } from '@/components/StatItem';
import { Tooltip, TooltipContent } from '@/components/Tooltip';
import { useLocalizedSiFormatter } from '@/utils/si.utils';
import { AverageEffectivePeriods } from './minerStats.types';
import { useActiveCoin } from '@/rdx/localSettings/localSettings.hooks';
import useMinerStatsQuery from '@/hooks/api/useMinerStatsQuery';
import useMinerStatsChartQuery from '@/hooks/api/useMinerStatsChartQuery';
import { average } from '@/utils/number.utils';

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

const ReportedHashrateWrapper = styled.div`
  vertical-align: middle;

  & span {
    font-size: 1.125rem;
    display: inline;
  }
`;

const FlexFarmerLink = styled.a`
  color: var(--success);
`;

export const MinerStats: React.FC<{
  coin: string;
  address: string;
  worker?: string;
}> = ({ coin, address, worker }) => {
  const { data: minerStatsState, isLoading } = useMinerStatsQuery({
    coin,
    address,
    worker,
  });

  const { data: averageEffectivePeriods } = useMinerStatsChartQuery(
    {
      coin,
      address,
      worker,
    },
    {
      select: (data): AverageEffectivePeriods => {
        const nowMinus12 = subHours(new Date(), 12);
        const nowMinus6 = subHours(new Date(), 6);

        const pastSixHours = data?.reduce((acc, curr) => {
          if (isAfter(new Date(curr.timestamp * 1000), nowMinus6)) {
            acc.push(curr.effectiveHashrate);
          }
          return acc;
        }, [] as number[]);

        const pastTwelveHours = data?.reduce((acc, curr) => {
          if (isAfter(new Date(curr.timestamp * 1000), nowMinus12)) {
            acc.push(curr.effectiveHashrate);
          }
          return acc;
        }, [] as number[]);

        return {
          '6': pastSixHours ? average(pastSixHours) : 0,
          '12': pastTwelveHours ? average(pastTwelveHours) : 0,
        };
      },
    }
  );

  const totalShares =
    (minerStatsState &&
      minerStatsState.invalidShares +
        minerStatsState.staleShares +
        minerStatsState.validShares) ||
    0;
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
            value={siFormatter(minerStatsState?.currentEffectiveHashrate, {
              unit: activeCoin?.hashrateUnit,
            })}
          />
          <Tooltip
            icon={
              <StatItem
                title={t('stats.hashrate.average')}
                value={siFormatter(minerStatsState?.averageEffectiveHashrate, {
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
                  {siFormatter(averageEffectivePeriods?.[12], {
                    unit: activeCoin?.hashrateUnit,
                  })}
                </strong>
              </AverageTooltipItem>
              <AverageTooltipItem>
                6h Average:{' '}
                <strong>
                  {siFormatter(averageEffectivePeriods?.[6], {
                    unit: activeCoin?.hashrateUnit,
                  })}
                </strong>
              </AverageTooltipItem>
            </TooltipContent>
          </Tooltip>
          <StatItem
            title={t('stats.hashrate.reported')}
            value={
              isLoading || !minerStatsState ? undefined : (
                <ReportedHashrateWrapper>
                  {siFormatter(minerStatsState?.reportedHashrate, {
                    unit: activeCoin?.hashrateUnit,
                  })}{' '}
                  {String(activeCoin?.ticker) === 'xch' &&
                    minerStatsState?.reportedHashrate === 0 && (
                      <Tooltip>
                        <TooltipContent>
                          Only available with{' '}
                          <FlexFarmerLink
                            href="/get-started/xch/flexfarmer"
                            target="_blank"
                          >
                            FlexFarmer
                          </FlexFarmerLink>
                        </TooltipContent>
                      </Tooltip>
                    )}
                </ReportedHashrateWrapper>
              )
            }
          />
        </StatItemGrid>
      </Card>
      <Card padding>
        <CardTitle>
          {`${t(
            String(activeCoin?.ticker) === 'xch'
              ? 'stats.shares.title_points'
              : 'stats.shares.title'
          )} (${t('stats.shares.title_hint')})`}
        </CardTitle>
        <StatItemGrid>
          <StatItem
            title={getDisplayPercentage(
              t('stats.shares.valid'),
              totalShares,
              minerStatsState?.validShares
            )}
            value={siFormatter(minerStatsState?.validShares, {
              shortenAbove: 100000,
            })}
          />
          <StatItem
            title={getDisplayPercentage(
              t('stats.shares.stale'),
              totalShares,
              minerStatsState?.staleShares
            )}
            value={siFormatter(minerStatsState?.staleShares, {
              shortenAbove: 100000,
            })}
          />
          <StatItem
            title={getDisplayPercentage(
              t('stats.shares.invalid'),
              totalShares,
              minerStatsState?.invalidShares
            )}
            value={siFormatter(minerStatsState?.invalidShares, {
              shortenAbove: 100000,
            })}
          />
        </StatItemGrid>
      </Card>
    </StatGrid>
  );
};

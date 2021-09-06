import React from 'react';
import { useTranslation } from 'next-i18next';
import { Card } from 'src/components/layout/Card';
import { Skeleton } from 'src/components/layout/Skeleton';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import {
  useLocalizedActiveCoinValueFormatter,
  useLocalizedActiveCoinValueConverter,
} from 'src/hooks/useDisplayReward';
import { useFeePayoutLimitDetails } from 'src/hooks/useFeePayoutDetails';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from 'src/utils/si.utils';
import styled from 'styled-components';

const NoFeeLimit = styled.div`
  color: var(--text-secondary);
`;

const NetworkFee = styled.div`
  color: var(--text-secondary);
`;

const Item = styled.div`
  display: flex;
  font-weight: 600;
  margin-right: 2rem;
  white-space: nowrap;
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media screen and (max-width: 900px) {
    margin-top: -0.5rem;
    ${Item} {
      margin-top: 0.5rem;
      flex-grow: 1;
      flex-shrink: 0;
      margin-right: 1rem;
      display: block;
    }
  }
  @media screen and (max-width: 500px) {
    margin-top: -0.5rem;
    ${Item} {
      width: calc(50% - 2rem);
    }
  }
`;
export const MinerDetails: React.FC<{
  coin?: ApiPoolCoin;
}> = ({ coin }) => {
  const minerDetailsState = useReduxState('minerDetails');
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const activeCoinConverter = useLocalizedActiveCoinValueConverter();
  const settings = minerDetailsState.data;
  const activeCoinTicker = useActiveCoinTicker();
  const payoutLimit = activeCoinFormatter(settings?.payoutLimit);
  const networkFeeValue = activeCoinConverter(settings?.currentNetworkFeePrice);
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const minerHeaderStatsState = useReduxState('minerHeaderStats');
  const maxFeePrice = settings?.maxFeePrice;
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const numberFormatter = useLocalizedNumberFormatter();

  const counterValuePrice = currencyFormatter(
    minerHeaderStatsState.data?.countervaluePrice || 0
  );

  const networkFee = React.useMemo(() => {
    if (
      typeof feeDetails?.multiplier !== 'undefined' &&
      networkFeeValue !== null
    ) {
      const fee = numberFormatter(networkFeeValue * feeDetails?.multiplier, {
        maximumFractionDigits: 0,
      });

      return `${fee} ${feeDetails.unit}`;
    }

    return undefined;
  }, [
    networkFeeValue,
    feeDetails?.multiplier,
    feeDetails?.unit,
    numberFormatter,
  ]);

  const feeTicker = currencyFormatter(
    ((Number(maxFeePrice) *
      Number(coin?.transactionSize) *
      Number(feeDetails?.multiplier)) /
      Math.pow(10, Number(coin?.decimalPlaces))) *
      Number(minerHeaderStatsState.data?.countervaluePrice)
  );
  const feeTickerPercentage = numberFormatter(
    (Number(maxFeePrice) *
      Number(coin?.transactionSize) *
      Number(feeDetails?.multiplier)) /
      Math.pow(10, Number(coin?.decimalPlaces)) /
      (Number(settings?.payoutLimit) /
        Math.pow(10, Number(coin?.decimalPlaces))),
    { style: 'percent', maximumFractionDigits: 3 }
  );

  const { t } = useTranslation('dashboard');
  const dateFormatter = useLocalizedDateFormatter();

  return (
    <Card paddingShort>
      <Content>
        <Item>
          <div>{t('header.info_payout_limit')}:&nbsp;</div>
          <div>{settings && coin ? payoutLimit : <Skeleton width={40} />}</div>
        </Item>
        {activeCoinTicker === 'eth' ? (
          <Tooltip
            wrapIcon={false}
            icon={
              <Item>
                <div>{t('header.info_gas_limit')}:&nbsp;</div>
                {typeof maxFeePrice === 'undefined' ||
                typeof networkFee === 'undefined' ||
                feeDetails === null ? (
                  <Skeleton width={40} />
                ) : (
                  <>
                    {maxFeePrice === 0 ? (
                      <NoFeeLimit>{t('header.info_gas_limit_none')}</NoFeeLimit>
                    ) : (
                      <div>{maxFeePrice + ' ' + feeDetails?.unit}</div>
                    )}
                    <NetworkFee>&nbsp;{`(${networkFee} now)`}</NetworkFee>
                  </>
                )}
              </Item>
            }
          >
            <TooltipContent>
              <p>
                {maxFeePrice && maxFeePrice > 0 ? (
                  <strong>
                    {feeTicker},{' '}
                    {t('header.info_gas_limit_detail', {
                      percent: feeTickerPercentage,
                    })}
                  </strong>
                ) : feeTicker && feeTickerPercentage ? (
                  <strong>{t('header.info_gas_limit_detail_none')}</strong>
                ) : (
                  <strong>{t('header.info_gas_limit_detail_na')}</strong>
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <></>
        )}
        <Tooltip
          wrapIcon={false}
          icon={
            <Item>
              <div>{t('header.info_joined')}:&nbsp;</div>
              <div>
                {settings ? (
                  settings.firstJoined === 0 ? (
                    'Recently'
                  ) : (
                    <>
                      {dateFormatter.distanceFromNow(
                        settings.firstJoined * 1000
                      )}
                    </>
                  )
                ) : (
                  <Skeleton width={50} />
                )}
              </div>
            </Item>
          }
        >
          <TooltipContent>
            <p>
              {!settings?.firstJoined ? (
                t('header.info_joined_tooltip_empty')
              ) : (
                <strong>
                  {t('header.info_joined_tooltip')}{' '}
                  {dateFormatter.dateAndTime(settings.firstJoined * 1000)}
                </strong>
              )}
            </p>
          </TooltipContent>
        </Tooltip>
        <Item>
          <div>{t('header.info_coin_price', { coin: coin?.name })}:&nbsp;</div>
          <div>{counterValuePrice || <Skeleton width={40} />}</div>
        </Item>
      </Content>
    </Card>
  );
};

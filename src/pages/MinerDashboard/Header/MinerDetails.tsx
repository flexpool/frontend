import React from 'react';
import { useTranslation } from 'next-i18next';
import { Card } from 'src/components/layout/Card';
import { Skeleton } from 'src/components/layout/Skeleton';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { useFeePayoutLimitDetails } from 'src/hooks/useFeePayoutDetails';
import useMinerDetailsQuery from '@/hooks/api/useMinerDetailsQuery';
import useMinerBalance from '@/hooks/useMinerBalance';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from 'src/utils/si.utils';
import styled from 'styled-components';
import useActiveCoinNetworkFee from '@/hooks/useActiveCoinNetworkFee';
import { isNil } from 'lodash';
import { stringUtils } from '@/utils/string.utils';
import NetworkLogo from '@/components/NetworkLogo';

const { titleCase } = stringUtils;

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
  address: string;
}> = ({ coin, address }) => {
  const { data: minerDetails, isLoading: isMinerDetailsLoading } =
    useMinerDetailsQuery({
      coin: coin?.ticker,
      address,
    });
  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();
  const activeCoinTicker = useActiveCoinTicker();
  const payoutLimit = activeCoinFormatter(minerDetails?.payoutLimit);
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const { data: minerBalance } = useMinerBalance(address, coin?.ticker);
  const maxFeePrice = minerDetails?.maxFeePrice;
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const numberFormatter = useLocalizedNumberFormatter();
  const currentNetworkFee = useActiveCoinNetworkFee(coin?.ticker, address);
  const counterValuePrice = currencyFormatter(minerBalance?.price || 0);

  const feeTicker = currencyFormatter(
    ((Number(maxFeePrice) *
      Number(coin?.transactionSize) *
      Number(feeDetails?.multiplier)) /
      Math.pow(10, Number(coin?.decimalPlaces))) *
      Number(minerBalance?.price)
  );
  const feeTickerPercentage = numberFormatter(
    (Number(maxFeePrice) *
      Number(coin?.transactionSize) *
      Number(feeDetails?.multiplier)) /
      Math.pow(10, Number(coin?.decimalPlaces)) /
      (Number(minerDetails?.payoutLimit) /
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
          <div>
            {minerDetails && coin ? payoutLimit : <Skeleton width={40} />}
          </div>
        </Item>
        {activeCoinTicker === 'eth' && minerDetails?.network === 'mainnet' ? (
          <Tooltip
            wrapIcon={false}
            icon={
              <Item>
                <div>{t('header.info_gas_limit')}:&nbsp;</div>
                {typeof maxFeePrice === 'undefined' ||
                isNil(currentNetworkFee) ||
                feeDetails === null ? (
                  <Skeleton width={40} />
                ) : (
                  <>
                    {maxFeePrice === 0 ? (
                      <NoFeeLimit>{t('header.info_gas_limit_none')}</NoFeeLimit>
                    ) : (
                      <div>{maxFeePrice + ' ' + feeDetails?.unit}</div>
                    )}
                    <NetworkFee>
                      &nbsp;{`(${currentNetworkFee} ${feeDetails.unit} now)`}
                    </NetworkFee>
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
                {minerDetails && !isMinerDetailsLoading ? (
                  minerDetails.firstJoined === 0 ? (
                    'Recently'
                  ) : (
                    <>
                      {dateFormatter.distanceFromNow(
                        minerDetails.firstJoined * 1000
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
              {!minerDetails?.firstJoined ? (
                t('header.info_joined_tooltip_empty')
              ) : (
                <strong>
                  {t('header.info_joined_tooltip')}{' '}
                  {dateFormatter.dateAndTime(minerDetails.firstJoined * 1000)}
                </strong>
              )}
            </p>
          </TooltipContent>
        </Tooltip>

        {minerDetails && minerDetails.network !== 'mainnet' && (
          <Item>
            <div>{t('header.network')}:&nbsp;</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <NetworkLogo
                network={minerDetails.network}
                ticker={activeCoinTicker}
              />
              <div style={{ marginLeft: '0.25rem' }}>
                {titleCase(minerDetails.network)}
              </div>
            </div>
          </Item>
        )}

        <Item>
          <div>{t('header.info_coin_price', { coin: coin?.name })}:&nbsp;</div>
          <div>{counterValuePrice || <Skeleton width={40} />}</div>
        </Item>
      </Content>
    </Card>
  );
};

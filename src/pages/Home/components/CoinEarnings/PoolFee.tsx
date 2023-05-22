import { useLocalizedPercentFormatter } from '@/utils/si.utils';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { Tooltip, TooltipContent } from '@/components/Tooltip';

type Props = {
  coin: string;
};

export const PoolFee = ({ coin }: Props) => {
  const { t } = useTranslation('home');
  const percentFormatter = useLocalizedPercentFormatter();

  const poolFee = getCoinPoolFee(coin);

  return (
    <p>
      {t('coin_earnings_cards.pool_fee', {
        value: percentFormatter(poolFee),
      })}{' '}
      {coin === 'xch' && (
        <Tooltip plus>
          <TooltipContent>
            {t('coin_earnings_cards.finder_reward', {
              value: `+ 0.25 ${coin.toUpperCase()}`,
            })}
          </TooltipContent>
        </Tooltip>
      )}
    </p>
  );
};

// TODO: Can move to minableCoins so it's easier to manage
const getCoinPoolFee = (coin: string) => {
  return coin === 'eth'
    ? 9 / 1000
    : coin === 'etc'
    ? 9 / 1000
    : coin === 'xch'
    ? 7 / 1000
    : coin === 'zil'
    ? 20 / 1000
    : coin === 'btc'
    ? 1 / 1000
    : coin === 'tiron'
    ? 0
    : coin === 'iron'
    ? 95 / 10000
    : 10 / 1000;
};

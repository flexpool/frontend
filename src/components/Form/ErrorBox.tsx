import React from 'react';
import { useTranslation } from 'next-i18next';
import { InfoBox } from '../InfoBox';
import { ErrorWithMessage } from '@/types/query.types';
import { useActiveCoinTicker } from '@/rdx/localSettings/localSettings.hooks';

export const ErrorBox: React.FC<{ error?: ErrorWithMessage | null }> = ({
  error,
}) => {
  const { t } = useTranslation('common');
  const coin = useActiveCoinTicker();
  if (error) {
    return (
      <InfoBox variant="error">
        {t(`errors.${error.code}`, {
          defaultValue: undefined,
          coin: coin.toUpperCase(),
        }) || error.message}
      </InfoBox>
    );
  } else {
    return null;
  }
};

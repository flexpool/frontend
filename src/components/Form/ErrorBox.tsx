import React from 'react';
import { useTranslation } from 'react-i18next';
import { InfoBox } from '../InfoBox';

export const ErrorBox: React.FC<{ error?: { message: string } | null }> = ({
  error,
}) => {
  const { t } = useTranslation('common');
  if (error) {
    return <InfoBox variant="error">{t(`errors.${error.message}`)}</InfoBox>;
  } else {
    return null;
  }
};

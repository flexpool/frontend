import React from 'react';
import { useTranslation } from 'next-i18next';
import { CheckboxField } from '@/components/Form/Checkbox';

const AcknowledgeCheckbox = () => {
  const { t } = useTranslation('dashboard');

  return (
    <CheckboxField
      label={t('dashboard:settings.difficulty.acknowledge')}
      name="acknowledge"
    />
  );
};

export default AcknowledgeCheckbox;

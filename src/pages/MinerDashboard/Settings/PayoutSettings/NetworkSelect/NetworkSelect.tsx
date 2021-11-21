import React, { useMemo } from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { get } from 'lodash';
import { DownshiftSelectField as Select } from '@/components/Form/DownshiftSelect';

const NetworkOptions = [
  {
    label: 'Mainnet',
    value: 'mainnet',
  },
  {
    label: 'Polygon',
    value: 'polygon',
  },
];

const NetworkSelect = () => {
  const { values } = useFormikContext();
  const { t } = useTranslation(['common']);

  const network = useMemo(() => get(values, 'network'), [values]);

  const description = useMemo(() => {
    if (network === 'polygon') {
      return t('dashboard:settings.payout.eth_polygon');
    }

    return t('dashboard:settings.payout.eth_mainnet');
  }, [network, t]);

  return (
    <Select
      name="network"
      items={NetworkOptions}
      label="Network"
      desc={description}
    />
  );
};

export default NetworkSelect;

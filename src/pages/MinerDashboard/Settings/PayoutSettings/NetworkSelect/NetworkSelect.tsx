import React from 'react';
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
  return <Select name="network" items={NetworkOptions} label="Network" />;
};

export default NetworkSelect;

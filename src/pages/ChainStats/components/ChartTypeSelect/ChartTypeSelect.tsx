import React from 'react';
import DownshiftSelect from '@/components/Form/DownshiftSelect';

type ChartTypeSelectProps<T = string> = {
  onSelect: (value: T) => void;
  value: T;
};

const CHART_TYPE_OPTIONS = [
  { value: 'difficulty', label: 'Difficulty Chart' },
  { value: 'hashrate', label: 'Hashrate Chart' },
  { value: 'blockTime', label: 'Block Time Chart' },
];

export type ChartType = 'difficulty' | 'hashrate' | 'blockTime';

export const ChartTypeSelect = ({ onSelect, value }: ChartTypeSelectProps) => {
  const selected = CHART_TYPE_OPTIONS.find((option) => option.value === value);

  return (
    <div style={{ marginLeft: 'auto' }}>
      <DownshiftSelect
        items={CHART_TYPE_OPTIONS}
        selectedItem={selected}
        onSelectedItemChange={(v) => {
          onSelect(v.selectedItem?.value as string);
        }}
      />
    </div>
  );
};

export default ChartTypeSelect;

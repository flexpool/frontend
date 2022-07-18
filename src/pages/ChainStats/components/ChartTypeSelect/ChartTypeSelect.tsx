import React from 'react';
import styled from 'styled-components';
import { AiOutlineLineChart } from 'react-icons/ai';
import DownshiftSelect, {
  DownshiftDropdownSelect,
} from '@/components/Form/DownshiftSelect';
import { Button } from '@/components/Button';
import { ChartType } from '../../types';

type ChartTypeSelectProps<T = string> = {
  onSelect: (value: T) => void;
  value: T;
};

const CHART_TYPE_OPTIONS = [
  { value: 'difficulty', label: 'Difficulty Chart' },
  { value: 'hashrate', label: 'Hashrate Chart' },
  { value: 'blocktime', label: 'Block Time Chart' },
];

const ChartTypeButton = styled(Button)`
  font-size: 1.5rem;
  min-width: 48px;
  height: 48px;
`;

const DesktopBreakpoint = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;

const MobileBreakpoint = styled.div`
  display: block;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const ChartTypeSelect = ({ onSelect, value }: ChartTypeSelectProps) => {
  const selected = CHART_TYPE_OPTIONS.find((option) => option.value === value);

  return (
    <div style={{ marginLeft: 'auto' }}>
      <DesktopBreakpoint>
        <DownshiftSelect
          items={CHART_TYPE_OPTIONS}
          selectedItem={selected}
          onSelectedItemChange={(v) => {
            onSelect(v.selectedItem?.value as string);
          }}
        />
      </DesktopBreakpoint>

      <MobileBreakpoint>
        <DownshiftDropdownSelect
          items={CHART_TYPE_OPTIONS}
          selectedItem={selected}
          onSelectedItemChange={(v) => {
            onSelect(v.selectedItem?.value as string);
          }}
        >
          {(props) => {
            return (
              <ChartTypeButton size="sm" shape="square" {...props}>
                <AiOutlineLineChart />
              </ChartTypeButton>
            );
          }}
        </DownshiftDropdownSelect>
      </MobileBreakpoint>
    </div>
  );
};

export default ChartTypeSelect;

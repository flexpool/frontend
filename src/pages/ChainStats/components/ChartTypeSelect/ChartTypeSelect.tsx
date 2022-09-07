import React from 'react';
import styled from 'styled-components';
import { RiListSettingsLine } from 'react-icons/ri';
import DownshiftSelect, {
  DownshiftDropdownSelect,
} from '@/components/Form/DownshiftSelect';
import { Button } from '@/components/Button';
import { useTranslation } from 'react-i18next';

type ChartTypeSelectProps<T = string> = {
  onSelect: (value: T) => void;
  value: T;
  coin: string;
  options: { label: string; value: string }[];
};

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

export const ChartTypeSelect = ({
  onSelect,
  value,
  options,
}: ChartTypeSelectProps) => {
  const selected = options.find((option) => option.value === value);

  return (
    <div style={{ marginLeft: 'auto' }}>
      <DesktopBreakpoint>
        <DownshiftSelect
          items={options}
          selectedItem={selected}
          onSelectedItemChange={(v) => {
            onSelect(v.selectedItem?.value as string);
          }}
        />
      </DesktopBreakpoint>

      <MobileBreakpoint>
        <DownshiftDropdownSelect
          items={options}
          selectedItem={selected}
          onSelectedItemChange={(v) => {
            onSelect(v.selectedItem?.value as string);
          }}
        >
          {(props) => {
            return (
              <ChartTypeButton size="sm" shape="square" {...props}>
                <RiListSettingsLine />
              </ChartTypeButton>
            );
          }}
        </DownshiftDropdownSelect>
      </MobileBreakpoint>
    </div>
  );
};

export default ChartTypeSelect;

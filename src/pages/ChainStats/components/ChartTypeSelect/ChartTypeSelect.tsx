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
  hashrateUnit: string;
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
  hashrateUnit,
}: ChartTypeSelectProps) => {
  const { t: commonT } = useTranslation('common');

  const CHART_TYPE_OPTIONS = [
    { value: 'difficulty', label: commonT('difficulty') },
    { value: 'hashrate', label: commonT('hashrate') },
    { value: 'blocktime', label: commonT('blocktime') },
  ];

  const SPACE_CHART_TYPE_OPTIONS = [
    { value: 'difficulty', label: commonT('difficulty') },
    { value: 'hashrate', label: commonT('hashrate_space') },
    { value: 'blocktime', label: commonT('blocktime') },
  ];

  const options =
    hashrateUnit === 'B' ? SPACE_CHART_TYPE_OPTIONS : CHART_TYPE_OPTIONS;
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

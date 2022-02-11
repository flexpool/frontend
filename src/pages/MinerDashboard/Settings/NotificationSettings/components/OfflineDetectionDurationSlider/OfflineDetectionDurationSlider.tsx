import React from 'react';
import { Form, Formik, useField } from 'formik';
import styled from 'styled-components';
import * as Slider from '@radix-ui/react-slider';

const StyledSlider = styled(Slider.Root)`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  height: 20px;

  &[data-disabled] {
    opacity: 0.6;
    pointer-events: none;
  }
`;

const StyledTrack = styled(Slider.Track)`
  cursor: pointer;
  background-color: var(--bg-secondary);
  position: relative;
  flex-grow: 1;
  border-radius: 99999px;
  height: 4px;
`;
const StyledRange = styled(Slider.Range)`
  cursor: pointer;
  position: absolute;
  background-color: var(--primary);
  border-radius: 99999px;
  height: 100%;
`;

const StyledThumb = styled(Slider.Thumb)`
  all: unset;
  display: block;
  width: 20px;
  height: 20px;
  background-color: var(--primary);
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 1px 10px var(--primary-shadow);
  }
`;

const durationOptions = [
  {
    key: '5m',
    value: 300,
  },
  {
    key: '10m',
    value: 600,
  },
  {
    key: '20m',
    value: 1200,
  },
  {
    key: '30m',
    value: 1800,
  },
  {
    key: '1h',
    value: 3600,
  },
  {
    key: '2h',
    value: 7200,
  },
  {
    key: '4h',
    value: 14400,
  },
  {
    key: '8h',
    value: 28800,
  },
  {
    key: '16h',
    value: 57600,
  },
  {
    key: '24h',
    value: 86400,
  },
];

const Label = styled.div<{ index: number; total: number }>`
  position: absolute;
  font-size: 0.85rem;
  font-weight: 500;
  transform: translateX(-50%);
  left: calc(
    ${(p) => (p.index === 0 ? 0 : (p.index / (p.total - 1)) * 100)}% +
      ${(p) => 10 * (1 - 0.111111 * p.index * 2)}px
  );
  color: var(--text-secondary);
`;

const LabelContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  top: 18px;
`;

const StepLabels = () => {
  return (
    <LabelContainer>
      {durationOptions.map(({ key }, index) => {
        return (
          <Label key={key} index={index} total={durationOptions.length}>
            {key}
          </Label>
        );
      })}
    </LabelContainer>
  );
};

const SliderLabel = styled.label`
  font-size: 0.875rem;
  text-transform: uppercase;
  color: var(--text-primary);
  font-weight: 700;
  display: inline-block;
  margin-bottom: 0.5rem;
`;

const OfflineDetectionDurationSlider = ({ disabled = false }) => {
  const [field, , { setValue }] = useField('workerOfflineDetectionDuration');

  const optionIndex = durationOptions.findIndex(
    (option) => option.value === field.value
  );

  return (
    <div>
      <SliderLabel>Worker Offline Detection Duration</SliderLabel>
      <StyledSlider
        disabled={disabled}
        defaultValue={[optionIndex]}
        max={durationOptions.length - 1}
        step={1}
        aria-label="Duration"
        onValueChange={(value) => {
          setValue(durationOptions[value[0]].value);
        }}
      >
        <StyledTrack>
          <StyledRange />
          <StepLabels />
        </StyledTrack>
        <StyledThumb />
      </StyledSlider>
    </div>
  );
};

export default OfflineDetectionDurationSlider;

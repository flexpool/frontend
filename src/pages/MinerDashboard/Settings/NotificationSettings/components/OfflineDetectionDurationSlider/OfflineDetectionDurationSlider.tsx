import React from 'react';
import { useField } from 'formik';
import styled from 'styled-components';
import * as Slider from '@radix-ui/react-slider';
import { useTranslation } from 'next-i18next';

const StyledSlider = styled(Slider.Root)`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  height: 20px;
  margin-bottom: 94px;

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
    description: '5 minutes',
    value: 300,
  },
  {
    key: '10m',
    description: '10 minutes',
    value: 600,
  },
  {
    key: '20m',
    description: '20 minutes',
    value: 1200,
  },
  {
    key: '30m',
    description: '30 minutes',
    value: 1800,
  },
  {
    key: '1h',
    description: '1 hour',
    value: 3600,
  },
  {
    key: '2h',
    description: '2 hours',
    value: 7200,
  },
  {
    key: '4h',
    description: '4 hours',
    value: 14400,
  },
  {
    key: '8h',
    description: '8 hours',
    value: 28800,
  },
  {
    key: '16h',
    description: '16 hours',
    value: 57600,
  },
  {
    key: '24h',
    description: '24 hours',
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

const SliderHint = styled.div`
  margin-top: 46px;
  max-width: 480px;
`;

const OfflineDetectionDurationSlider = ({ disabled = false }) => {
  const [field, , { setValue }] = useField('workerOfflineDetectionDuration');
  const { t } = useTranslation(['dashboard']);

  const optionIndex = durationOptions.findIndex(
    (option) => option.value === field.value
  );

  return (
    <div>
      <SliderLabel>
        {t(
          'dashboard:settings.notifications.worker_offline_detection_duration'
        )}
      </SliderLabel>
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
          <SliderHint>
            {t('dashboard:settings.notifications.offline_duration', {
              duration: durationOptions[optionIndex].description,
            })}
          </SliderHint>
        </StyledTrack>
        <StyledThumb />
      </StyledSlider>
    </div>
  );
};

export default OfflineDetectionDurationSlider;

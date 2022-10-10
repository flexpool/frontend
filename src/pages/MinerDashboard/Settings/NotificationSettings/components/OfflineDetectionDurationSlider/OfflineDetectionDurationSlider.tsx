import React from 'react';
import { useField } from 'formik';
import styled, { css } from 'styled-components';
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

const Label = styled.div<{ index: number; total: number }>`
  position: absolute;
  font-size: 0.85rem;
  font-weight: 500;
  transform: translateX(-50%);
  ${(p) => {
    const base = p.index === 0 ? 0 : (p.index / (p.total - 1)) * 100;
    const shift = 10 * (1 - 0.111111 * p.index * 2);

    return css`
      left: calc(${base}% + ${shift}px);
    `;
  }};
  color: var(--text-secondary);
`;

const LabelContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  top: 18px;
`;

const StepLabels = ({ options }: { options: SlideOption[] }) => {
  return (
    <LabelContainer>
      {options.map(({ key }, index) => {
        return (
          <Label key={key} index={index} total={options.length}>
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
  margin-bottom: 14px;
`;

const SliderHint = styled.div`
  margin-top: 46px;
  max-width: 480px;
`;

type SlideOption = {
  key: string;
  description: string;
  value: number;
};

type Second = number;

const OfflineDetectionDurationSlider = ({
  disabled = false,
  options,
}: {
  disabled: boolean;
  options: Second[];
}) => {
  const [field, , { setValue }] = useField('workerOfflineDetectionDuration');
  const { t } = useTranslation(['dashboard']);
  const { t: commonT } = useTranslation('common');

  const hoursLabel = commonT('hours');
  const minutesLabel = commonT('minutes');

  const durationOptions = options.map((option) => {
    let minutes,
      hours = 0;

    if (option < 60 * 60) {
      minutes = option / 60;
    } else {
      hours = option / 60 / 60;
    }

    if (minutes) {
      return {
        key: `${minutes}m`,
        value: option,
        description: `${minutes} ${minutesLabel}`,
      };
    }

    return {
      key: `${hours}h`,
      value: option,
      description: `${hours} ${hoursLabel}`,
    };
  });
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
          <StepLabels options={durationOptions} />
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

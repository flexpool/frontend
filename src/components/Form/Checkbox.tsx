import { Field } from 'formik';
import styled from 'styled-components';
import { BaseFormFieldProps, getInputProps } from './formikUtils';
import { FieldWrap } from './FormWrap';

const LabelWrap = styled.label<{ disabled?: boolean }>`
  position: relative;
  cursor: pointer;
  display: flex;
  ${(p) =>
    p.disabled &&
    `
    pointer-events: none;
    opacity: .6;
  `}
`;

const Check = styled.div`
  transform: scale(0.1) rotate(-0deg);
  height: 12px;
  width: 7px;
  border-bottom: 3px solid white;
  border-right: 3px solid white;
  border-radius: 2px;
  transition: 0.2s all;
  opacity: 0;
`;

const TickBox = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 5px;
  border: ${(p) => p.theme.border.default};
  background: var(--bg-secondary);
  transition: 0.2s all;
  margin-right: 0.5rem;
`;

const SInput = styled.input`
  display: none;
  &:checked {
    & + ${TickBox} {
      background: ${(p) => p.theme.color.primary};
      border-color: ${(p) => p.theme.color.primary};
      ${Check} {
        opacity: 1;
        transform: translateY(-1px) rotate(45deg);
      }
    }
  }
`;

const Label = styled.span`
  display: inline-block;
  color: ${(p) => p.theme.text.primary};
`;

export const Checkbox = (
  props: BaseFormFieldProps & JSX.IntrinsicElements['input']
) => {
  const { placeholder, name, value, onChange, onBlur, label } =
    getInputProps(props);

  return (
    <FieldWrap>
      <LabelWrap disabled={props.disabled}>
        <SInput
          type="checkbox"
          checked={value}
          {...{ placeholder, name, value, onChange, onBlur }}
          {...props.field}
          disabled={props.disabled}
        />
        <TickBox>
          <Check />
        </TickBox>
        <Label>{label}</Label>
      </LabelWrap>
    </FieldWrap>
  );
};

/**
 * Formik version
 */
export const CheckboxField: typeof Checkbox = (props) => {
  return <Field component={Checkbox} {...props} />;
};

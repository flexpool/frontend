import { Field, FieldProps } from 'formik';
import React from 'react';
import styled from 'styled-components/macro';
import { BaseFormFieldProps, getInputProps } from './formikUtils';
import { FieldWrap } from './FormWrap';

const SText = styled.input`
  display: block;
  width: 100%;
  cursor: text;
  font-weight: 600;
  background: var(--bg-secondary);
  &:focus {
    border-color: ${(p) => p.theme.color.primary};
  }
  height: 48px;
  outline: none;
  border: none;
  border-radius: none;
  color: var(--text-primary);
  padding: 0 1rem;
`;

const SUnit = styled.div`
  flex-grow: 0;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  background: var(--border-color);
  font-size: 0.875rem;
  font-family: 'Roboto mono';
  font-weight: 500;
`;

const Wrapper = styled.div`
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid var(--bg-secondary);
  display: flex;
  &:focus-within,
  &:hover {
    border-color: var(--primary);
  }
`;

export const TextInput: React.FC<
  JSX.IntrinsicElements['input'] &
    BaseFormFieldProps &
    Partial<FieldProps<any>> & {
      unit?: React.ReactNode;
    }
> = (p) => {
  const {
    unit,
    autoComplete,
    spellCheck,
    type = 'text',
    inputMode,
    ...props
  } = getInputProps(p);

  return (
    <FieldWrap {...props}>
      <Wrapper>
        <SText
          type={type}
          inputMode={inputMode}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          name={props.name}
          placeholder={props.placeholder}
          disabled={props.disabled}
          autoComplete={autoComplete}
          spellCheck={spellCheck}
        />
        {unit && <SUnit>{unit}</SUnit>}
      </Wrapper>
    </FieldWrap>
  );
};

/**
 * Formik version
 */
export const TextField: typeof TextInput = (props) => {
  return <Field component={TextInput} {...props} />;
};

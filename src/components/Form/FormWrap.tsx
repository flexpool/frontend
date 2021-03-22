import React from 'react';
import styled from 'styled-components/macro';
import { BaseFormFieldProps, getInputProps } from './formikUtils';

const SErrorWrapper = styled.div`
  color: ${(p) => p.theme.color.danger};
  margin-top: 0.5rem;
`;

const SLabel = styled.label`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: ${(p) => p.theme.text.primary};
  font-weight: 700;
  display: inline-block;
  & + * {
    margin-top: 0.5rem;
  }
`;

export const FieldWrap = <
  P extends BaseFormFieldProps & { children: React.ReactNode }
>(
  p: P
) => {
  const { label, children, errorMessage, name, desc } = getInputProps(p);
  return (
    <div data-id="field-wrap">
      {label && <SLabel htmlFor={name}>{label}</SLabel>}
      {children}
      {desc && <p>{desc}</p>}
      {errorMessage && <SErrorWrapper>{errorMessage}</SErrorWrapper>}
    </div>
  );
};

//

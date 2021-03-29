import React from 'react';
import styled from 'styled-components/macro';
import { BaseFormFieldProps, getInputProps } from './formikUtils';

const SErrorWrapper = styled.div`
  color: var(--danger);
  margin-top: 0.5rem;
`;

const SLabel = styled.label`
  font-size: 0.875rem;
  text-transform: uppercase;
  color: ${(p) => p.theme.text.primary};
  font-weight: 700;
  display: inline-block;
  & + * {
    margin-top: 0.5rem;
  }
`;

const Wrapper = styled.div``;

export const FieldWrap = <
  P extends BaseFormFieldProps & { children: React.ReactNode }
>(
  p: P
) => {
  const { label, children, errorMessage, name, desc } = getInputProps(p);
  return (
    <Wrapper>
      {label && <SLabel htmlFor={name}>{label}</SLabel>}
      {children}
      {desc && <p>{desc}</p>}
      {errorMessage && <SErrorWrapper>{errorMessage}</SErrorWrapper>}
    </Wrapper>
  );
};

//

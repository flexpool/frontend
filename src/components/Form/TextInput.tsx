import { Field, FieldProps } from 'formik';
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

const Wrapper = styled.div`
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid var(--bg-secondary);
  &:focus-within,
  &:hover {
    border-color: var(--primary);
  }
`;

export const TextInput: React.FC<
  JSX.IntrinsicElements['input'] & BaseFormFieldProps & Partial<FieldProps<any>>
> = (p) => {
  const props = getInputProps(p);

  return (
    <FieldWrap {...props}>
      <Wrapper>
        <SText
          type="text"
          value={props.value}
          onChange={props.onChange}
          name={props.name}
          placeholder={props.placeholder}
        />
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

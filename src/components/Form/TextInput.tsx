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
`;
export const TextInput: React.FC<
  JSX.IntrinsicElements['input'] & BaseFormFieldProps & Partial<FieldProps<any>>
> = (p) => {
  const props = getInputProps(p);

  return (
    <FieldWrap {...props}>
      <SText
        type="text"
        value={props.value}
        onChange={props.onChange}
        name={props.name}
        placeholder={props.placeholder}
      />
    </FieldWrap>
  );
};

/**
 * Formik version
 */
export const TextField: typeof TextInput = (props) => {
  return <Field component={TextInput} {...props} />;
};

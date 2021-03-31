import { FieldProps } from 'formik';
import React from 'react';

/**
 * flattens props if component is inside formik
 * @param props
 */
export const getInputProps = <
  P extends Partial<FieldProps<any>> & {
    errorMessage?: React.ReactNode;
  }
>(
  props: P
) => {
  const errorMessageFromFormik = props.field?.name
    ? props.form?.errors[props.field?.name]
    : props.errorMessage;

  return {
    ...props,
    ...props.field,
    errorMessage: errorMessageFromFormik,
    value: (props as any).value || props?.field?.value || '',
  };
};

export type BaseFormFieldProps = {
  placeholder?: string;
  label?: React.ReactNode;
  errorMessage?: React.ReactNode;
  desc?: React.ReactNode;
} & Partial<FieldProps<any>>;

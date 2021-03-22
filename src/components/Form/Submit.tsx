import React from 'react';
import { Field, FieldProps } from 'formik';
import { Button } from 'src/components/Button';
import { PropsOf } from 'src/types/ReactHelp.types';

type ButtonSubmitFieldProps = PropsOf<typeof Button> & {
  disableWhenFormNotDirty?: boolean;
};

const ButtonField: React.FunctionComponent<
  FieldProps & ButtonSubmitFieldProps
> = (props) => {
  const { children, form, field, disableWhenFormNotDirty, ...rest } = props;
  return (
    <Button
      {...rest}
      type="submit"
      variant="primary"
      disabled={disableWhenFormNotDirty && !form.dirty}
    >
      {children}
    </Button>
  );
};

export const Submit: React.FunctionComponent<ButtonSubmitFieldProps> = (
  props
) => {
  return <Field component={ButtonField} {...props} />;
};

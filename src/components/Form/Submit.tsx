import React from 'react';
import { Field, FieldProps } from 'formik';
import { Button } from 'src/components/Button';
import { PropsOf } from 'src/types/ReactHelp.types';
import { LoaderDots } from 'src/components/Loader/LoaderDots';

type ButtonSubmitFieldProps = PropsOf<typeof Button> & {
  disableWhenFormNotDirty?: boolean;
  captchaDisableOverride?: boolean;
  shape?: string;
};

const ButtonField: React.FunctionComponent<
  FieldProps & ButtonSubmitFieldProps
> = (props) => {
  const {
    children,
    form,
    field,
    disableWhenFormNotDirty,
    captchaDisableOverride,
    ...rest
  } = props;
  return (
    <>
      <Button
        variant="primary"
        {...rest}
        type="submit"
        disabled={
          !form.dirty ||
          form.isSubmitting ||
          Object.keys(form.errors).length !== 0 ||
          captchaDisableOverride ||
          disableWhenFormNotDirty
        }
      >
        {form.isSubmitting || captchaDisableOverride ? <LoaderDots /> : children}
      </Button>
    </>
  );
};

export const Submit: React.FunctionComponent<ButtonSubmitFieldProps> = (
  props
) => {
  return <Field component={ButtonField} {...props} />;
};

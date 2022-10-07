import React from 'react';
import { Formik, FormikValues, FormikProps } from 'formik';

export const GuideForm = <Values extends FormikValues = FormikValues>({
  children,
  initialValue,
}: {
  children: (props: FormikProps<Values>) => React.ReactNode | React.ReactNode;
  initialValue: Values;
}) => {
  return (
    <Formik initialValues={initialValue} onSubmit={() => {}}>
      {children}
    </Formik>
  );
};

export default GuideForm;

import React, { createContext, useState, useContext } from 'react';
import { Formik, FormikValues, FormikProps } from 'formik';

type ContextValue = {
  ids: string[];
  add: (id: string) => void;
  get: (id: string) => number;
  remove: (id: string) => void;
};

const GuideContext = createContext<ContextValue | undefined>(undefined);

const GuideProvider = ({ children }: { children: React.ReactNode }) => {
  const [ids, setIds] = useState<string[]>([]);

  return (
    <GuideContext.Provider
      value={{
        ids,
        add: (id: string) => setIds((ids) => [...ids, id]),
        get: (id: string) => ids.indexOf(id),
        remove: (id: string) => {
          setIds((i) => i.filter((i) => i !== id));
        },
      }}
    >
      {children}
    </GuideContext.Provider>
  );
};

export const useGuide = () => {
  const context = useContext(GuideContext);

  if (context === undefined) {
    throw new Error('useGuide must be used inside GuideProvider');
  }

  return context;
};

export const GuideForm = <Values extends FormikValues = FormikValues>({
  children,
  initialValue,
}: {
  children: (props: FormikProps<Values>) => React.ReactNode | React.ReactNode;
  initialValue: Values;
}) => {
  return (
    <GuideProvider>
      <Formik initialValues={initialValue} onSubmit={() => {}}>
        {children}
      </Formik>
    </GuideProvider>
  );
};

export default GuideForm;

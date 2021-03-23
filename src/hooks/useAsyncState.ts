import React from 'react';

const style1 = 'color: #aaa; font-weight: "normal"';
const style2 = 'font-weight: bold;';

const consola = (title: string, desc: string, ...t: any[]) => {
  console.group(`%c${title} %c${desc}`, style1, style2);

  console.log(...t);
  console.groupEnd();
};

export const useAsyncState = <T = any, E = any>(
  title?: string,
  defaultState?: T
) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setValue] = React.useState<T | null>(defaultState || null);
  const [error, setError] = React.useState<E | null>(null);

  const start = React.useCallback(
    async (p: Promise<T>, options?: { reset?: boolean }) => {
      if (isLoading) {
        return Promise.reject('Already loading');
      }

      consola('asyncState', `${title || ''}_START`);
      setIsLoading(true);
      setError(null);
      if (options?.reset) {
        setValue(defaultState || null);
      }
      return p
        .then((res) => {
          setIsLoading(false);
          setValue(res);
          consola('asyncState', `${title || ''}_SUCCESS`);
          return res;
        })
        .catch((e) => {
          setIsLoading(false);
          setError(e);
          consola('asyncState', `${title || ''}_ERROR`, 'Error', e);
          return Promise.reject(e);
        });
    },
    [isLoading, defaultState, title]
  );

  const startMerge = React.useCallback(
    async (p: Promise<T>) => {
      if (isLoading) {
        return Promise.reject('Already loading');
      }

      consola('asyncState', `${title || ''}_Append_START`);
      setIsLoading(true);
      setError(null);
      return p
        .then((res) => {
          setIsLoading(false);
          setValue({
            ...data,
            ...res,
          });
          consola('asyncState', `${title || ''}_Append_SUCCESS`, 'Result', res);
          return res;
        })
        .catch((e) => {
          setIsLoading(false);
          setError(e);
          consola('asyncState', `${title || ''}_Append_ERROR`, 'Error', e);
          return Promise.reject(e);
        });
    },
    [isLoading, data, title]
  );

  const clearErrorMessage = () => {
    setError(null);
  };

  return {
    isLoading,
    start,
    startMerge,
    data,
    error,
    clearErrorMessage,
  };
};

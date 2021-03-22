import React from 'react';

export const useLocalCollectionState = <C extends { [key: string]: any }>(
  key: string
) => {
  const storageState = localStorage.getItem(key);

  const defaultState = (storageState ? JSON.parse(storageState) : {}) as C;

  const [data, set] = React.useState(defaultState);

  const setItem = React.useCallback(
    <K extends keyof C>(itemKey: K, value: C[K]) => {
      const nextState = {
        ...data,
        [itemKey]: value,
      };
      set(nextState);
      localStorage.setItem(key, JSON.stringify(nextState));
    },
    [data, key, set]
  );

  const setState = React.useCallback(
    (d: C) => {
      const nextState = {
        ...data,
        ...d,
      };

      localStorage.setItem(key, JSON.stringify(nextState));
      set(nextState);
    },
    [set, data, key]
  );

  const reset = React.useCallback(() => {
    localStorage.setItem(key, JSON.stringify({}));
    set({} as C);
  }, [key]);

  return { setItem, reset, data, set: setState };
};

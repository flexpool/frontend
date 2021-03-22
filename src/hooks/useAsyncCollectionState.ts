import React from 'react';
import {
  arrayToKeyDataObject,
  KeyedDataObject,
} from 'src/utils/arrayObjectUtils';
import { useBoolState } from './useBoolState';

const style1 = 'color: #aaa; font-weight: "normal"';
const style2 = 'font-weight: bold;';

export const useAsyncCollectionState = <D extends object, E extends any = any>(
  title: string,
  key: keyof D
) => {
  const [data, setData] = React.useState<KeyedDataObject<D>>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<E | null>(null);
  const hasMoreState = useBoolState(true);

  const consola = React.useCallback(
    (desc: string, ...t: any[]) => {
      console.group(`%c${title} %c${desc}`, style1, style2);

      console.log(...t);
      console.groupEnd();
    },
    [title]
  );

  const load = React.useCallback(
    async (
      promise: Promise<D[]>,
      opts: { append?: boolean; limit: number }
    ) => {
      const options = {
        ...opts,
      };
      if (isLoading) {
        consola('Already loading');
      }

      consola('asyncState', `${title || ''}_START`);
      setIsLoading(true);
      setError(null);
      if (!options.append) {
        // not appending so reseting to default state
        setData({});
        hasMoreState.handleTrue();
      }
      promise
        .then((res) => {
          setIsLoading(false);

          if (res.length < options.limit) {
            hasMoreState.handleFalse();
          }

          const mapped = arrayToKeyDataObject(res, key);
          if (options.append) {
            setData({
              ...data,
              ...mapped,
            });
          } else {
            setData(mapped);
          }

          consola('asyncState', `${title || ''}_SUCCESS`, 'Result');
          return res;
        })
        .catch((e) => {
          setIsLoading(false);
          setError(e);
          consola('asyncState', `${title || ''}_ERROR`, 'Error', e);
          return Promise.reject(e);
        });
    },
    [isLoading, data, consola, hasMoreState, key, title]
  );

  const append = React.useCallback(
    (item: D) => {
      setData({
        ...data,
        ...arrayToKeyDataObject([item], key),
      });
    },
    [data, key]
  );

  const remove = React.useCallback(
    (id: any) => {
      const nextData = { ...data };
      delete nextData[id];
      setData(nextData);
    },
    [data]
  );

  return {
    isLoading,
    load,
    data,
    error,
    hasMore: hasMoreState.value,
    append,
    remove,
  };
};

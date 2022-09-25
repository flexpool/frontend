import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { omitBy, isUndefined } from 'lodash';

export type ValuesOf<T extends any[]> = T[number];

const useNextQueryParams = <T extends string[]>(...args: T) => {
  const router = useRouter();

  const [params, setParams] = useState<{ [key in ValuesOf<T>]: string }>();

  useEffect(() => {
    if (router.isReady && typeof params === 'undefined') {
      const params = args.reduce((acc, key) => {
        const value = router.query[key];
        acc[key] = value;
        return acc;
      }, {} as { [key in ValuesOf<T>]: string });

      setParams(params);
    }
  }, [router, setParams, params, args]);

  const setValues = (input: { [key in ValuesOf<T>]?: string | undefined }) => {
    setParams((oldParams) => {
      const newParams = { ...oldParams, ...input } as {
        [key in ValuesOf<T>]: string;
      };

      const urlSearchParams = new URLSearchParams(
        omitBy(newParams, isUndefined)
      );

      setTimeout(() => {
        router.replace(
          {
            pathname: router.asPath.replace(/\?.*/, ''),
            query: urlSearchParams.toString(),
          },
          undefined,
          { shallow: true }
        );
      }, 0);

      return newParams;
    });
  };

  return [
    params as { [key in T[number]]: string | undefined },
    setValues,
  ] as const;
};

export default useNextQueryParams;

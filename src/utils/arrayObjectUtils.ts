export type KeyedDataObject<I> = { [key: string]: I };

export const arrayToKeyDataObject = <I extends object>(
  data: I | I[],
  key: keyof I
) => {
  if (Array.isArray(data)) {
    const result: KeyedDataObject<I> = data.reduce((acc, next) => {
      const keyValue = (next[key] as unknown) as string;
      return {
        ...acc,
        [keyValue]: next,
      };
    }, {});

    return result;
  }

  return {
    [(data[key] as unknown) as string]: data,
  };
};

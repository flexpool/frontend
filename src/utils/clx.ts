type ClxItemObject = { [key: string]: any };
export type ClxItem = string | ClxItemObject | undefined | null;

const clxObject = (c: ClxItemObject = {}) => {
  try {
    const entries = Object.entries(c) || [];

    return entries
      .map(([key, value]) => {
        if (value) {
          return key;
        }

        return null;
      })
      .filter((item) => !!item)
      .join(" ");
  } catch {
    return null;
  }
};

/**
 * combines classnames
 */
export const clx = (...args: ClxItem[]) => {
  return args
    .map((item) => {
      if (!item) {
        return null;
      }

      if (typeof item === "string") {
        return item;
      }

      return clxObject(item);
    })
    .filter((item) => !!item)
    .join(" ");
};

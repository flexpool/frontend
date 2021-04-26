import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

const siSymbols = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

type FormatSiOptions = {
  unit?: string;
  decimals?: number;
  /**
   * default is 1000
   * 1000: 23402 => 23.4 k, 1504 => 1.4 k
   * 10000: 23402 => 23.4 k, 1504 => 1,504
   * 100000: 23402 => 23,402, 1504 => 1,504
   */
  shortenAbove?: number;
  lang?: string;
};

const useLocalizedNumberValueFormatter = () => {
  const { i18n } = useTranslation();
  const formatter = useCallback(
    (value: number) => {
      return Intl.NumberFormat(i18n.language).format(value);
    },
    [i18n.language]
  );

  return formatter;
};

export const useLocalizedSiFormatter = () => {
  const numberFormatter = useLocalizedNumberValueFormatter();

  return useCallback(
    (value?: number, opts?: FormatSiOptions) => {
      const options = {
        decimals: 1,
        shortenAbove: 1000,
        unit: '',
        ...opts,
      };

      let decimals = options.decimals;

      if (typeof value === 'undefined') {
        return null;
      }

      var siN = 0;

      while (value >= options.shortenAbove) {
        if (siN >= siSymbols.length) {
          break;
        }
        siN++;
        value /= 1000;
      }

      if (value < 10 && decimals === 1) decimals = 2;

      return `${numberFormatter(
        Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
      )} ${siSymbols[siN]}${options.unit}`;
    },
    [numberFormatter]
  );
};

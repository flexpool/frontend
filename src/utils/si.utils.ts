import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';

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

/**
 *
 * @param currency if not provided, will use user's set counter ticker
 * @returns
 */
export const useLocalizedCurrencyFormatter = (currency?: string) => {
  const counterTicker = useCounterTicker();
  return useLocalizedNumberFormatter({
    style: 'currency',
    currency: currency || counterTicker,
    maximumFractionDigits: 2,
    currencyDisplay: 'narrowSymbol',
  });
};

export const useLocalizedPercentFormatter = () => {
  return useLocalizedNumberFormatter({
    style: 'percent',
    maximumFractionDigits: 2,
  });
};

export const useLocalizedNumberFormatter = (
  defaultOptions?: Intl.NumberFormatOptions | undefined
) => {
  const { i18n } = useTranslation();
  const formatter = useCallback(
    (
      value: number,
      options: Intl.NumberFormatOptions | undefined = defaultOptions
    ) => {
      return new Intl.NumberFormat(i18n.language, {
        ...defaultOptions,
        ...options,
      }).format(value);
    },
    [i18n.language, defaultOptions]
  );

  return formatter;
};

export const useLocalizedSiFormatter = () => {
  const numberFormatter = useLocalizedNumberFormatter();

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

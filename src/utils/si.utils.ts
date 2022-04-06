import { useTranslation } from 'next-i18next';
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
    currencyDisplay: 'symbol',
  });
};

export const useLocalizedPercentFormatter = () => {
  return useLocalizedNumberFormatter({
    style: 'percent',
    maximumFractionDigits: 2,
  });
};

// FIXME: defaultOptions will break useCallback
export const useLocalizedNumberFormatter = (
  defaultOptions?: Intl.NumberFormatOptions | undefined
) => {
  const { i18n } = useTranslation();
  const formatter = useCallback(
    (
      value: number,
      options: Intl.NumberFormatOptions | undefined = defaultOptions
    ) => {
      if (options?.currency === 'lambo') {
        if (value < 0.001 && value > 0) {
          return new Intl.NumberFormat(i18n.language, {
            ...defaultOptions,
            ...options,
            maximumFractionDigits: 3,
            currency: 'usd',
          })
            .format(value * 1000)
            .replace('USD', 'mŁ')
            .replace('$', 'mŁ')
            .replace('US', '');
        }

        return new Intl.NumberFormat(i18n.language, {
          ...defaultOptions,
          ...options,
          maximumFractionDigits: 3,
          currency: 'usd',
        })
          .format(value)
          .replace('USD', 'Ł')
          .replace('$', 'Ł')
          .replace('US', '');
      }

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

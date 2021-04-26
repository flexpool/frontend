import { useTranslation } from 'react-i18next';

const siSymbols = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

type FormatSiOptions = {
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

export const formatSi = (
  value?: number,
  unit: string = '',
  opts?: {
    decimals?: number;
    /**
     * default is 1000
     * 1000: 23402 => 23.4 k, 1504 => 1.4 k
     * 10000: 23402 => 23.4 k, 1504 => 1,504
     * 100000: 23402 => 23,402, 1504 => 1,504
     */
    shortenAbove?: number;
    lang?: string;
  }
) => {
  const options = {
    decimals: 1,
    shortenAbove: 1000,
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

  return `${Intl.NumberFormat(options.lang).format(
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
  )} ${siSymbols[siN]}${unit}`;
};

/**
 * will format with si with selected language
 * @returns
 */
export const useLocalizedFormatSi = () => {
  const { i18n } = useTranslation();

  return (value?: number, unit = '', options?: FormatSiOptions) => {
    return formatSi(value, unit, {
      ...options,
      lang: i18n.language,
    });
  };
};

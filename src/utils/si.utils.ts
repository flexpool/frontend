const siSymbols = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

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

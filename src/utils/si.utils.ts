export const formatSi = (value: number, unit: string, decimals = 1) => {
  const siSymbols = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

  var siN = 0;

  while (value >= 1000) {
    if (siN >= siSymbols.length) {
      break;
    }
    siN++;
    value /= 1000;
  }

  if (value < 10 && decimals === 1) decimals = 2;

  return `${
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
  } ${siSymbols[siN]}${unit}`;
};

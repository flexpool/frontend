export const isValidNumber = (value: any) => {
  const n = Number(value);
  return isNaN(n) ? false : true;
};

export const sum = (data: number[]) =>
  data.reduce((prev, next) => prev + next, 0);

export const average = (data: number[]) => sum(data) / data.length;

export const getDecimalPlace = (num: number) => {
  const str = num.toString();
  const index = str.indexOf('.');
  return index === -1 ? 0 : str.length - index - 1;
};

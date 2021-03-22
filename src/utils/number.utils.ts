export const isValidNumber = (value: any) => {
  const n = Number(value);
  return isNaN(n) ? false : true;
};

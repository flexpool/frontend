export const checksumIron = (input: string) => {
  const regex = /^[A-Fa-f0-9]{64}$/;
  const check = regex.test(input);

  if (check) return input;
  return null;
};

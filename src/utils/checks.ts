export const workerNameCheck = (s: string) => {
  return /^[\w.-]+$/.test(s);
};

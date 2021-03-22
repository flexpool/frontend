export const filterUnique = <V>(value: V, index: number, self: V[]) => {
  return self.indexOf(value) === index;
};

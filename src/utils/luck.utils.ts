export const getDisplayLuck = (luck?: number) =>
  luck ? `${Math.round(luck * 100 * 10) / 10}%` : null;

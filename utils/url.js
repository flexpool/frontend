export const getLocationSearch = () => {
  return typeof window !== 'undefined' ? window.location.search : '';
};

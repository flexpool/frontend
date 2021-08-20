export const getLocationSearch = () => {
  return typeof window !== 'undefined' ? window.location.search : '';
};

export const getDynamicManifestUrl = (locale, page) => {
  const url = `/api/manifest?url=/${locale + page}`;
  // On homepages('/') /en-GB , /en-US etc the pathname /en-GB/ needs to get last / trimmed
  // in order to prompt install app for homepages through the dynamic manifest
  let trimmedUrl = url;
  if (url[url.length - 1] === '/') trimmedUrl = url.substring(0, url.length - 1);
  return trimmedUrl;
};

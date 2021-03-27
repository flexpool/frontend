const titleCase = (text: string = '') => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const snakeToTitle = (text: string = '') => {
  return text
    .toLowerCase()
    .split('_')
    .map((item) => titleCase(item))
    .join(' ');
};

const trim = (text: string, maxLen = 100) => {
  return text.length > maxLen ? text.substring(0, maxLen - 3) + '...' : text;
};

const shortenString = (str: string, chars = 8) => {
  var charsStart = 10;
  if (str.startsWith('0x')) {
    charsStart = chars + 2;
  }
  return (
    str.substring(0, charsStart) +
    '…' +
    str.substring(str.length - chars, str.length)
  );
};

export const stringUtils = {
  titleCase,
  snakeToTitle,
  trim,
  shortenString,
};

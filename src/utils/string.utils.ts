const titleCase = (text: string = "") => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const snakeToTitle = (text: string = "") => {
  return text
    .toLowerCase()
    .split("_")
    .map((item) => titleCase(item))
    .join(" ");
};

const trim = (text: string, maxLen = 100) => {
  return text.length > maxLen ? text.substring(0, maxLen - 3) + "..." : text;
};

export const stringUtils = {
  titleCase,
  snakeToTitle,
  trim,
};

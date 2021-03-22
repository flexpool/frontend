import { dateUtils, isValidDate } from "./date.utils";
import { isValidNumber } from "./number.utils";
import { stringUtils } from "./string.utils";

type TransformerFunction = <O>(
  value: any,
  options?: O
) => string | null | undefined | number;

const wrap = (foo: TransformerFunction) => (
  ...args: Parameters<TransformerFunction>
) => {
  try {
    return foo(...args);
  } catch {
    return args[0];
  }
};

const date: TransformerFunction = (val: any) => {
  return dateUtils.short(val);
};

const date_time: TransformerFunction = (val: any) => {
  return dateUtils.shortWithTime(val);
};

const no_transformation: TransformerFunction = (value: any) => {
  if (!value) {
    return null;
  }

  /**
   * number
   */
  if (isValidNumber(value)) {
    return value;
  }

  /**
   * date
   */
  if (isValidDate(value as any)) {
    return dateUtils.shortWithTime(value as any);
  }

  /**
   * string
   */
  if (typeof value === "string") {
    return value;
  }

  /**
   * array
   */
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return JSON.stringify(value);
};

const transformFunctions = {
  default: no_transformation,
  date,
  date_time,
};
export type TransformFunctionType = keyof typeof transformFunctions;

export const valueTransformers = Object.keys(
  transformFunctions
) as TransformFunctionType[];

export const valueTransformOptions = valueTransformers.map((item) => ({
  value: item,
  label: stringUtils.snakeToTitle(item),
}));

export const transformValue = (
  transformer: string = "default",
  value: any,
  options?: any
): number | string | null | undefined => {
  if (
    transformer !== "default" &&
    valueTransformers.includes(transformer as TransformFunctionType)
  ) {
    return wrap(
      transformFunctions[transformer as keyof typeof transformFunctions]
    )(value, options);
  }

  return wrap(transformFunctions.default)(value, options);
};

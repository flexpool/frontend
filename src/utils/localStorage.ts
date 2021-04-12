import { isWeb } from './devUtils';

export const localStorage = <T>(
  key: string,
  options?: {
    defaultValue: T;
  }
) => {
  const defaultValue = options?.defaultValue || null;
  return {
    set: (data: T) => {
      try {
        if (isWeb()) {
          window.localStorage.setItem(key, JSON.stringify(data));
        } else {
          console.log(
            'Trying to access localStorage outside web. No data will be saved.'
          );
        }
      } catch (e) {
        console.log('Local Storage Error', e);
      }
    },
    get: () => {
      try {
        if (isWeb()) {
          try {
            return (
              (JSON.parse(window.localStorage.getItem(key) || '') as T) ||
              defaultValue
            );
          } catch (e) {
            console.log(e);
            return defaultValue;
          }
        } else {
          console.log(
            'Trying to access localStorage outside web. Cannot read.'
          );
          return defaultValue;
        }
      } catch (e) {
        return defaultValue;
      }
    },
    remove: () => {
      try {
        if (isWeb()) {
          window.localStorage.removeItem(key);
        } else {
          console.log(
            'Trying to access localStorage outside web. No data will be saved.'
          );
        }
      } catch (e) {
        console.log('Local Storage Error', e);
      }
    },
  };
};

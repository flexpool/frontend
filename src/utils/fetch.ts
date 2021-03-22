import qs from "query-string";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3010";

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  query?: any;
  body?: any;
};

const transformFetchOptions = (
  options: ApiFetchOptions = {}
): ApiFetchOptions & { body?: string } => {
  return {
    ...options,
    body: JSON.stringify(options.body),
    headers: {
      "Content-type": "application/json",
    },
  };
};

export const apiFetch = async <T>(
  path: string,
  opts: ApiFetchOptions = {}
): Promise<T> => {
  const { query, ...init } = transformFetchOptions(opts);

  const url = new URL(API_URL);
  url.pathname = path;

  // add query
  if (query) {
    url.search = qs.stringify(query);
  }

  return fetch(url.toString(), init).then(async (res) => {
    if (res.status >= 200 && res.status < 300) {
      return res.json().catch(() => undefined);
    }

    return res
      .json()
      .then((json) => {
        return Promise.reject({
          ...json,
          status: res.status,
        });
      })
      .catch((e) => {
        return Promise.reject({
          ...e,
          status: res.status,
        });
      });
  });
};

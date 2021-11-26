import qs from 'query-string';

export const apiURL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;
export const chiaURL = process.env.NEXT_PUBLIC_REACT_APP_CHIA_API_URL;

// TODO: Chia API is no longer used, and it is safe to remove it

const transformQuery = (query?: object) => {
  return (query && qs.stringify(query)) || '';
};

const buildUri = (url = '', query?: object, api?: string) => {
  let resUrl: URL;
  if (url.startsWith('http')) {
    resUrl = new URL(url);
  } else {
    const apiURLToUse =
      window.location.hostname === 'web.fpmirror.com'
        ? 'https://api.fpmirror.com/v2'
        : apiURL;
    resUrl = new URL(`${api === 'chia' ? chiaURL : apiURLToUse}${url}`);
  }
  resUrl.search = (query && transformQuery(query)) || '';

  return resUrl.toString();
};

const transformBody = (
  body?: object
): FormData | ArrayBuffer | string | null => {
  if (!body) {
    return null;
  }
  if (body instanceof FormData || body instanceof ArrayBuffer) {
    return body;
  }

  return JSON.stringify(body);
};

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  query?: any;
  body?: any;
};

/**
 * GET example fetchApi('/pathname')
 * GET example with search query fetchApi('/pathname', { query: { limit: 10 } } )
 * POST example fetchApi('/pathname', { method: 'POST', body: { some: 'data' } } )
 *
 *
 *
 *
 * @param {*} path
 * @param {*} initParam
 */
export const fetchApi = async <T>(
  url: string,
  initParam: ApiFetchOptions = {},
  api?: string
): Promise<T> => {
  const { query, ...init } = initParam;

  const options = {
    ...init,
    // body: JSON.stringify(init?.body),
    body: transformBody(init?.body),
    headers: {
      accept: 'application/json',
      ...init?.headers,
      ...(init.method
        ? {
            'Content-type': 'application/json',
          }
        : {}),
    },
  };

  return fetch(buildUri(url, query, api), options).then(async (res) => {
    // SUCCESS
    if (res.status >= 200 && res.status < 300) {
      return res
        .json()
        .then((json) => {
          /**
           * API returns { error?, result? }
           */
          if (json.error) {
            return Promise.reject(json.error);
          } else {
            return json.result;
          }
        })
        .catch(() => {
          /** couldn't parse body, assume OK response with no body */
          return Promise.resolve();
        });
    }

    // SOME ERROR CODE
    return res.json().then((json) => {
      return Promise.reject({
        status: res.status,
        ...json,
      });
    });
  });
};

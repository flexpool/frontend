export type Error = {
  status: number;
  results: null;
  error: string;
};

export type ErrorWithMessage = {
  code: number;
  message: string;
  status: number;
};

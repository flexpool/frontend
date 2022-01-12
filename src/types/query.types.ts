export type Error = {
  result: null;
  error: string;
};

export type ErrorWithMessage = {
  code: number;
  message: string;
  status: number;
};

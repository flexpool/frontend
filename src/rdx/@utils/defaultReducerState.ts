import { DefaultState, DefaultArrayState, CollectionState } from './types';

export const defaultReducerState: DefaultState<any> = {
  invalidatedAt: null,
  data: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  lastGetStartAt: null,
  lastGetSuccessAt: null,
  counterGet: 0,
  error: null,
};

export const defaultReducerArrayState: DefaultArrayState<any> = {
  invalidatedAt: null,
  data: [], // note: empty array even if no request was attempted
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  lastGetStartAt: null,
  lastGetSuccessAt: null,
  counterGet: 0,
  error: null,
  pagination: {
    skip: 0,
    limit: 50,
    count: 0,
  },
};

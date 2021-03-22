import { DefaultArrayState, DefaultState } from './types';

const REFETCH_AFTER_MS = 60 * 1000 * 10; // 10 minutes

export const shouldRefetch = <T>(
  state: DefaultState<T> | DefaultArrayState<T>,
  refetchAfter = REFETCH_AFTER_MS
) => {
  if (state.isLoading) {
    return false;
  }
  if (!state.lastGetStartAt) {
    return true;
  }
  if (state.invalidatedAt && state.invalidatedAt > state.lastGetStartAt) {
    return true;
  }
  // TODO handle error state here?
  return state.lastGetStartAt.getTime() + refetchAfter < new Date().getTime();
};

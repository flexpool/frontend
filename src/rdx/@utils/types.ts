interface Pagination {
  skip: number;
  limit: number;
  count: number;
}

export interface IvalidatableState {
  invalidatedAt: Date | null;
}
type StateError = null | {
  message: string;
  [key: string]: any;
};

export interface BaseState extends IvalidatableState {
  isLoading: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  isCreating: boolean;
  lastGetStartAt: Date | null;
  lastGetSuccessAt: Date | null;
  /**
   * incremented on each get action
   */
  counterGet: number;
  error?: StateError;
}
export interface DefaultState<DataType> extends BaseState {
  data?: DataType | null;
}

export interface DefaultArrayState<DataType> extends BaseState {
  data: DataType[];
  pagination: Pagination;
}

export interface ReducerOptions {
  flushOnError?: boolean;
  flushOnStart?: boolean;
}

export interface ReducerOptionsExtended extends ReducerOptions {
  actionTypeStarts?: string[];
}

export type CollectionState<T extends object> = {
  isLoading: boolean | string | number;
  isDeleting: string | boolean | number;
  isUpdating: string | boolean | number;
  isCreating: boolean;
  isEnd: boolean;
  data: {
    [key: string]: T;
  };
  error?: StateError;
};

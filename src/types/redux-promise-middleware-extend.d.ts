/**
 * @types/redux-promise-middleware has incorrect typings for
 * dispatch, which should transform into Promise if applicable
 */

import 'redux';

declare module 'redux' {
  export interface BaseAction<TPayload> {
    type: string;
    payload: TPayload;
  }

  export interface Dispatch {
    <T extends BaseAction<any>>(action: T): T extends BaseAction<
      Promise<infer R>
    >
      ? Promise<{
          value: R;
          action: BaseAction<R>;
        }>
      : T;
  }
}

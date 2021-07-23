import { applyMiddleware, createStore, AnyAction, compose } from 'redux';

import { rootReducer, defaultReduxState, AppState } from './rootReducer';
import { createPromise as createPromiseMiddleware } from 'redux-promise-middleware';
import { isDev } from 'src/utils/devUtils';

export const createReduxStore = (preloadedState?: Partial<AppState>) => {
  const state = {
    ...defaultReduxState,
    ...preloadedState,
  };

  const isServer = process.env.BUILD_TARGET === 'server';

  const promiseMiddleware = createPromiseMiddleware({
    promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR'],
  });

  const middleware = [promiseMiddleware];

  // if (isDev() && !isServer) {
  //   // Add Redux Logger
  //   const createLogger = require('redux-logger').createLogger; // eslint-disable-line
  //   const logger = createLogger({
  //     collapsed: true,
  //     predicate: (getState: any, action: AnyAction) =>
  //       action.type !== '@ui/SET_WINDOW_DIMENSION',
  //   });
  //   middleware.push(logger);
  // }

  const composeEnhancers =
    (typeof window != 'undefined' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  const store = createStore(
    rootReducer,
    state,
    composeEnhancers(applyMiddleware(...middleware))
  );

  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('./rootReducer', () => {
  //     const nextRootReducer = require('./rootReducer').default;
  //     store.replaceReducer(nextRootReducer);
  //   });
  // }

  return store;
};

export default createReduxStore;

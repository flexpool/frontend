import { useSelector } from 'react-redux';
import { AppState } from './rootReducer';

export const useReduxState = <K extends keyof AppState>(key: K) =>
  useSelector((state: AppState) => state[key]);

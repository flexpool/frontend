import qs from 'query-string';
import { useLocation } from 'react-router';

export const useActiveSearchParamWorker = () => {
  const location = useLocation();
  const { worker } = qs.parse(location.search);

  return typeof worker === 'string' ? worker : undefined;
};

import qs from 'query-string';
import { useLocation } from 'react-router';
import { useRouter } from 'next/router';

export const useActiveSearchParamWorker = () => {
  const { worker } = qs.parse(
    typeof window !== 'undefined' ? window.location.search : ''
  );

  return typeof worker === 'string' ? worker : undefined;
};

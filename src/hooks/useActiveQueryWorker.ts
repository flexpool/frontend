import qs from 'query-string';
import { useLocation } from 'react-router';
import { useRouter } from 'next/router';

export const useActiveSearchParamWorker = () => {
  const router = useRouter();
  const { worker } = router.query;

  return typeof worker === 'string' ? worker : undefined;
};

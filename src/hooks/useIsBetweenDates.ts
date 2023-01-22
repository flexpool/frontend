import useIsMounted from './useIsMounted';
import { isAfter, isBefore } from 'date-fns';

type Props = {
  start: string | number;
  end: string | number;
  mode: 'inside' | 'outside';
};

export const useIsBetweenDates = ({ start, end, mode }: Props) => {
  const isMounted = useIsMounted();
  if (!isMounted) return false;

  let isBetween = false;

  const startDate = new Date(start);
  const endDate = new Date(end);
  const currentDate = Date.now();

  if (mode === 'inside') {
    isBetween =
      isAfter(currentDate, startDate) && isBefore(currentDate, endDate);
  } else {
    isBetween =
      isBefore(currentDate, startDate) || isAfter(currentDate, endDate);
  }

  return isBetween;
};

export default useIsBetweenDates;

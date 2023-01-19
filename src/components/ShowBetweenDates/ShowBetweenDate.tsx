import React from 'react';
import { isAfter, isBefore } from 'date-fns';
import useIsMounted from '@/hooks/useIsMounted';

type Props = {
  start: string | number;
  end: string | number;
  mode: 'inside' | 'outside';
  children: React.ReactNode;
};

export const ShowBetweenDate = ({ start, end, children, mode }: Props) => {
  const isMounted = useIsMounted();
  if (!isMounted) return <></>;

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

  if (!isBetween) return <></>;

  return <>{children}</>;
};

export default ShowBetweenDate;

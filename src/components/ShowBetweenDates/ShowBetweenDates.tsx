import React from 'react';

import { useIsBetweenDates } from '@/hooks/useIsBetweenDates';

type Props = {
  start: string | number;
  end: string | number;
  mode: 'inside' | 'outside';
  children: React.ReactNode;
};

export const ShowBetweenDates = ({ start, end, children, mode }: Props) => {
  const isBetween = useIsBetweenDates({
    start,
    end,
    mode,
  });

  if (!isBetween) return <></>;

  return <>{children}</>;
};

export default ShowBetweenDates;

import React from 'react';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import { Content } from '../layout/Content';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { UIVariant } from '@/App/styledTheme';
import useIsMounted from '@/hooks/useIsMounted';

const StyledAnnouncementBar = styled.div<{
  variant?: 'danger' | UIVariant;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  background-color: ${(p) => `var(--${p.variant})`};
  color: white;
  font-weight: 600;
  padding: 1rem;
  font-size: 0.85rem;
  text-align: center;
`;

const StyledContent = styled(Content)`
  position: relative;
`;

const Close = styled.button`
  position: absolute;
  right: 1rem;
  top: 0;
  background: none;
  border: none;
  color: white;
`;

type AnnouncementBarProps = {
  children: React.ReactNode;
  id: string;
  variant?: UIVariant;
  className?: string;
  removable?: boolean;
  targetTime?: number | null;
};

const AnnouncementBar = ({
  children,
  id,
  variant = 'danger',
  className,
  removable = true,
  targetTime = null,
}: AnnouncementBarProps) => {
  const isMounted = useIsMounted();
  const [closed, setClosed] = useLocalStorageState<boolean | number>(
    `announcement-bar-${id}`,
    targetTime === null ? false : targetTime
  );

  if (targetTime && targetTime !== closed) {
    setClosed(targetTime);
  }

  const isTargetTimeUp =
    typeof closed === 'number' ? Date.now() > closed : true;

  let isClosed = typeof closed === 'boolean' && closed === true;

  // this is for backwards compatibility
  if (typeof closed === 'string') {
    isClosed = true;
  }

  if (removable && (!isMounted || isClosed || !isTargetTimeUp)) return null;

  return (
    <StyledAnnouncementBar className={className} variant={variant}>
      <StyledContent>
        {removable && (
          <Close onClick={() => setClosed(true)}>
            <FaTimes />
          </Close>
        )}

        {children}
      </StyledContent>
    </StyledAnnouncementBar>
  );
};

export default AnnouncementBar;

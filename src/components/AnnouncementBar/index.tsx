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
};

const AnnouncementBar = ({
  children,
  id,
  variant = 'danger',
  className,
  removable = true,
}: AnnouncementBarProps) => {
  const [closed, setClosed] = useLocalStorageState(
    `announcement-bar-${id}`,
    'false'
  );
  const isMounted = useIsMounted();
  if (!isMounted || closed === 'true') return null;

  return (
    <StyledAnnouncementBar className={className} variant={variant}>
      <StyledContent>
        {removable && (
          <Close onClick={() => setClosed('true')}>
            <FaTimes />
          </Close>
        )}

        {children}
      </StyledContent>
    </StyledAnnouncementBar>
  );
};

export default AnnouncementBar;

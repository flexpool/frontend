import React from 'react';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import { Content } from '../layout/Content';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

const StyledAnnouncementBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  background-color: var(--danger);
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
};

const AnnouncementBar = ({ children, id }: AnnouncementBarProps) => {
  const [closed, setClosed] = useLocalStorageState(
    `announcement-bar-${id}`,
    'false'
  );

  if (closed === 'true') return null;

  return (
    <StyledAnnouncementBar>
      <StyledContent>
        <Close onClick={() => setClosed('true')}>
          <FaTimes />
        </Close>
        {children}
      </StyledContent>
    </StyledAnnouncementBar>
  );
};

export default AnnouncementBar;

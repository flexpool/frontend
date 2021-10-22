import React from 'react';
import styled from 'styled-components';

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

type AnnouncementBarProps = {
  children: React.ReactNode;
};

const AnnouncementBar = ({ children }: AnnouncementBarProps) => {
  return <StyledAnnouncementBar>{children}</StyledAnnouncementBar>;
};

export default AnnouncementBar;

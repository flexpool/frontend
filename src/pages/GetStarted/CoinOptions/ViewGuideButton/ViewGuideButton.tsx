import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

const StyledButton = styled.a`
  color: white;
  padding: 12px 10px 12px 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  white-space: pre;

  background-color: var(--primary);
  border-radius: 4px;

  transition: all 0.1s linear;

  svg {
    position: relative;
    left: 0;
    transition: left 0.1s linear;
  }

  &:hover {
    text-decoration: none;

    background-color: #1a79ff;

    svg {
      left: 3px;
    }
  }

  transition: color 0.1s linear;
`;

export const ViewGuideButton = ({
  href,
  children,
  color = 'var(--primary)',
  style,
}: {
  color?: string;
  href: string;
  children;
  style?: React.CSSProperties;
}) => {
  return (
    <Link href={href} passHref>
      <StyledButton
        style={{
          lineHeight: '16px',
          backgroundColor: color,
          ...style,
        }}
      >
        {children}
        <FiChevronRight />
      </StyledButton>
    </Link>
  );
};

export default ViewGuideButton;

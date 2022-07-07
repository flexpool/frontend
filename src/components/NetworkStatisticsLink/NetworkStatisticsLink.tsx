import styled from 'styled-components';
import Link from 'next/link';

const StyledLink = styled.a`
  color: var(--text-secondary);
  opacity: 0.5;
  font-size: 16px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s linear;

  &:hover {
    text-decoration: none;
    opacity: 1;
    transition: all 0.2s linear;
  }

  position: relative;
  top: -2px;
`;

const NetworkStatisticsLink = () => {
  return (
    <Link href="/network-stats" passHref>
      <StyledLink>View network statistics</StyledLink>
    </Link>
  );
};

export default NetworkStatisticsLink;

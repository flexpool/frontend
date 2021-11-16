import Link from 'next/link';
import styled from 'styled-components';
import { NLink } from '../components';
import { LinkOut } from '@/components/LinkOut';

export const MobileSlide = styled.div<{ isOpen?: boolean }>`
  width: 100%;
  max-width: 300px;
  position: fixed;
  top: 70px;
  left: 100%;
  bottom: 0;
  background: var(--bg-primary);
  z-index: 800;
  padding: 1rem;
  padding-bottom: 1.5rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  transition: 0.2s all;

  ${(p) =>
    p.isOpen &&
    `
    transform: translateX(-100%);
  `}
  box-shadow: 0 0 30px 0 rgba(0,0,0,0.1);
  ${NLink} {
    justify-content: flex-start;
    height: 50px;
    padding: 0 0rem;
  }
`;

export const SlideHideRest = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  top: 0;
  right: 100%;
  width: 200%;
  bottom: 0;
  background: var(--bg-primary);
  opacity: 0;
  visibility: hidden;
  ${(p) =>
    p.isOpen &&
    `
    opacity: .5;
    visibility: visible;
  `}
`;

export const StyledNavLink = styled.a`
  padding: 0.5rem 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.5rem;
  }
`;

export const MobileNavTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  padding-left: 1rem;
  text-transform: uppercase;
  margin-top: 1rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

type MobileNavLinkProps = {
  url: string;
  children: React.ReactNode;
  onClick?: () => void;
  external?: boolean;
};

export const MobileNavLink = ({
  url,
  children,
  onClick,
  external = false,
}: MobileNavLinkProps) => {
  if (external) {
    return (
      <StyledNavLink href={url} as={LinkOut} onClick={onClick}>
        {children}
      </StyledNavLink>
    );
  }

  return (
    <Link href={url} passHref>
      <StyledNavLink onClick={onClick}>{children}</StyledNavLink>
    </Link>
  );
};

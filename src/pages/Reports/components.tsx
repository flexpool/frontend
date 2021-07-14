import styled from 'styled-components/macro';
import { LinkOut } from 'src/components/LinkOut';

export const ReportArchiveItem = styled(LinkOut)`
  display: block;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--border-color);
  margin-bottom: -1px;
  align-items: center;
  &:hover {
    background: var(--bg-secondary);
    text-decoration: none;
  }
`;

export const ReportTitle = styled.span`
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

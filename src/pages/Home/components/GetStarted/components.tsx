import styled from 'styled-components';
import { Button } from 'src/components/Button';
export const StartButton = styled(Button)`
  color: var(--primary);
  background: var(--text-on-bg);
  border: none !important;
  &:hover {
    background: var(--text-on-bg);
    opacity: 0.9;
  }
`;

export const Wrapper = styled.section`
  background: var(--primary);
  h2 {
    color: var(--text-on-bg);
  }
`;

export const Split = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    & > *:not(:first-child) {
      margin-top: 1rem;
    }
  }
`;

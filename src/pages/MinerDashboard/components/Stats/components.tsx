import styled from 'styled-components/macro';
import { Card } from 'src/components/layout/Card';

export const WorkerTitle = styled.div`
  text-transform: uppercase;
  font-weight: 600;
`;
export const Worker = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  margin-top: 0.5rem;
`;

export const WorkerCard = styled(Card)`
  background: var(--primary);
  color: var(--text-on-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

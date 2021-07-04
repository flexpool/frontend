import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';

export const Wrap = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
`;

export const ToggleWrapper = styled.div`
  align-self: center;
`;

export const AutoUpdateWrapper = styled.div`
  display: flex;
  justify-content: center;
  color: var(--text-primary);
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const AutoUpdateText = styled.span`
  align-self: center;
  font-size: 1.1rem;
  font-weight: 600;
  margin-left: 9px;
  color: var(--text-primary);
  &.inactive {
    color: var(--text-secondary);
  }
`;

export const ActiveToggle = styled(FaToggleOn)`
  color: var(--primary);
  height: 20px;
  width: 40px;
`;

export const InactiveToggle = styled(FaToggleOff)`
  color: var(--text-secondary);
  height: 20px;
  width: 40px;
`;

export const ToggleWrapperButton = styled(Button)`
  min-width: 156px;
  padding: 0 0 0 0;
  border: none;
  height: 42px;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  color: var(--text-secondary);
  justify-content: center;
`;
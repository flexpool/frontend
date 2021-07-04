import styled from 'styled-components/macro';

export const EstimatedIntervalSwitch = styled.span`
  cursor: pointer;
  user-select: none;
  &:hover {
    color: var(--primary);
  }
`;

export const ProgressBarWrapper = styled.div`
  margin-top: 8px;
  width: 100%;
  height: 8px;
  padding: 0px !important;
  background-color: var(--border-color);
  display: flex;
  border-radius: 0px 0px 4px 4px;
  position: absolute;
  bottom: 0;
  left: 0;
`;

export const ProgressBar = styled.div`
  transition: 0.6s width cubic-bezier(0.35, 0.79, 0.37, 0.98);
  border-radius: 0px 0px 5px 5px;

  background-color: var(--primary);
`;

export const ErrorText = styled.span`
  color: var(--danger);
`;
export const SecondaryText = styled.span`
  color: var(--text-tertiary);
`;

export const PayoutText = styled.p`
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
`;

export const PayoutNumber = styled.span`
  color: var(--success);
`;

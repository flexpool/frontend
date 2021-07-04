import styled from "styled-components/macro";
import { FaSearch } from "react-icons/fa";
export const WorkerName = styled.span`
  color: var(--text-primary);
  white-space: nowrap;
  &:hover {
    color: var(--primary);
  }
  font-weight: 700;
`;

export const WorkerNameOffline = styled(WorkerName)`
  color: var(--danger) !important;
`;

export const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  transition: 0.2s all;
  color: var(--text-secondary);
`;
export const SearchInput = styled.input`
  height: 30px;
  width: 230px;
  border: none;
  border-bottom: 1.8px solid black;
  font-size: 15px;
  font-weight: 500;
  padding-bottom: 0.2px;
  border-radius: 0px;
  outline: none;
  padding-left: 1.5rem;
  display: block;
  background: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
  transition: 0.2s all;

  &:hover,
  &:focus {
    border-color: var(--primary);
    & + ${SearchIcon} {
      color: var(--text-primary);
    }
  }
`;

export const SearchBox = styled.div`
  display: flex;
  position: relative;
  margin-left: 1rem;
`;

export const ClearButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 100%;
  outline: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  height: 32px;
  width: 32px;
  background: transparent;
  opacity: 0.5;
  transition: 0.1s all;
  border-radius: 6px;
  &:hover,
  &:focus {
    opacity: 1;
  }
  &:hover {
    background: rgba(128, 128, 128, 0.08);
  }
  &:focus {
    background: rgba(128, 128, 128, 0.12);
  }
`;

export const ListHeader = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 1rem;
  margin-top: 2rem;
`;

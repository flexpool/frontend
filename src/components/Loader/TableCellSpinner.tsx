import styled from 'styled-components';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';

export const TableCellSpinner = styled(LoaderSpinner)`
  width: 14px;
  height: 14px;
  overflow: hidden;
  display: inline-block;
  margin-left: 0.5rem;
  svg circle {
    stroke: var(--text-tertiary);
  }
`;
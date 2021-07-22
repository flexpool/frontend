import styled from 'styled-components';
import { Document } from 'react-pdf/dist/esm/entry.webpack';

export const StyledDocument = styled(Document)`
  position: relative;
  display: flex;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem;
`;

export const PageContainer = styled.div`
  overflow: hidden;
`;
export const PageContainerInner = styled.div`
  transition: 0.4s all;
  flex-shrink: 0;
`;

export const Container = styled.div`
  border: 1px solid var(--border-color);
  position: relative;
  border-radius: 4px;
`;

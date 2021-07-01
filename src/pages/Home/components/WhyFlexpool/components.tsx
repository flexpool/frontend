import styled from 'styled-components/macro';
import { Img } from 'src/components/Img';
export const Wrapper = styled.div`
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
`;
export const Title = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
`;

export const Image = styled(Img)`
  height: 150px;
`;

export const ItemsContainer = styled.div`
  display: flex;
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  * {
    text-align: center;
  }
  p {
    color: var(--text-secondary);
  }
`;

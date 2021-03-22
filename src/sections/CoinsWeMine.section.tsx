import { Content } from 'src/components/layout/Content';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
  padding-top: 5rem;
  padding-bottom: 5rem;

  h2 {
    font-size: 2rem;
  }
`;

export const CoinsWeMineSection = () => {
  return (
    <Wrapper>
      <Content contentCenter>
        <h2>Coins we mine</h2>
        <p>
          Flexpool is a Multi-Coin mining pool, which means that you can mine
          your multiple favorite coins on Flexpool.
        </p>
      </Content>
    </Wrapper>
  );
};

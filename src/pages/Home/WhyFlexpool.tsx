import { Img } from 'src/components/Img';
import { Content } from 'src/components/layout/Content';
import { Spacer } from 'src/components/layout/Spacer';
import styled from 'styled-components/macro';
const Wrapper = styled.div`
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
`;
const Title = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
`;

const Image = styled(Img)`
  height: 150px;
`;

const ItemsContainer = styled.div`
  display: flex;
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const Item = styled.div`
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

export const WhyFlexpool = () => {
  return (
    <Wrapper>
      <Content padding>
        <Spacer size="xl" />
        <Title>Why Flexpool</Title>
        <ItemsContainer>
          <Item>
            <Image
              height="150"
              width="185"
              src="/illustrations/moon.svg"
              alt="Lightining speed"
            />
            <h3>Lightning speed</h3>
            <p>
              We use specialized high-performance server clusters powered by
              superfast software designed to handle over 100 TH/s.
            </p>
          </Item>
          <Item>
            <Image
              height="150"
              width="242"
              src="/illustrations/horseride.svg"
              alt="Great support"
            />
            <h3>Just Better</h3>
            <p>
              You can forget your poor mining experience. The Flexpool is backed
              by high-quality support, and we are always happy to help!
            </p>
          </Item>
        </ItemsContainer>
        <Spacer size="xl" />
      </Content>
    </Wrapper>
  );
};

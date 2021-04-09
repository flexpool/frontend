import { FaCoins, FaEye, FaQuestion, FaQuestionCircle } from 'react-icons/fa';
import { Button } from 'src/components/Button';
import { Content } from 'src/components/layout/Content';
import { Spacer } from 'src/components/layout/Spacer';
import { getCoinIconSrc, getCoinIconUrl } from 'src/utils/staticImage.utils';
import styled from 'styled-components/macro';

const Title = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
`;

const Image = styled.img`
  height: 180px;
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
    <Content padding>
      <Spacer size="xl" />
      <Title>Why Flexpool</Title>
      <ItemsContainer>
        <Item>
          <Image src="https://flexpool.io/static/assets/moon.svg" />
          <h3>Lightning speed</h3>
          <p>
            We use specialized high-performance server clusters powered by
            superfast software designed to handle over 100 TH/s.
          </p>
        </Item>
        <Item>
          <Image src="https://flexpool.io/static/assets/fees.svg" />
          <h3>No Fees</h3>
          <p>
            On <strong>Flexpool</strong>, there's no required fees. We only have
            an optional <strong>Pool Donation</strong> chosen by you.
          </p>
        </Item>
        <Item>
          <Image src="https://flexpool.io/static/assets/horseride.svg" />
          <h3>Just Better</h3>
          <p>
            You can forget your poor mining experience. The Flexpool is backed
            by high-quality support, and we are always happy to help!
          </p>
        </Item>
      </ItemsContainer>
      <Spacer size="xl" />
    </Content>
  );
};

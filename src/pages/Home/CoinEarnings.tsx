import {
  FaCoins,
  FaEye,
  FaQuestion,
  FaQuestionCircle,
  FaRocket,
} from 'react-icons/fa';
import { Button } from 'src/components/Button';
import { Content } from 'src/components/layout/Content';
import { Spacer } from 'src/components/layout/Spacer';
import { getCoinIconSrc, getCoinIconUrl } from 'src/utils/staticImage.utils';
import styled from 'styled-components/macro';

const UnknownCoin = styled.div`
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background: var(--warning);
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    height: 45%;
    width: 45%;
  }
`;

const CoinIcon = styled.img`
  width: 60px;
  height: 60px;
`;

const EarningBox = styled.div`
  * {
    color: white;
  }
  background: var(--bg-primary);
  background: linear-gradient(
    -1450deg,
    rgba(2, 0, 36, 0.1) 0%,
    rgba(255, 255, 255, 0.3) 100%
  );
  border-radius: 5px;
  /* border: 1px solid rgba(0, 0, 0, 0.1); */
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Container = styled.div`
  display: flex;
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const HeadSplit = styled.div`
  display: flex;
  & > *:first-child {
    flex-shrink: 0;
  }
  & > *:last-child {
    margin-top: 0.25rem;
  }
`;

const HeadContent = styled.div`
  margin-left: 1rem;
  p {
    margin-top: 0.25rem;
  }
`;
const IntervalContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
  justify-content: space-between;
  flex-grow: 1;
`;

const FiatValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.5rem;
`;
const IntervalItem = styled.div`
  margin-right: 2rem;
  p {
    margin-top: 0.25rem;
  }
`;

const StartMiningContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const CoinEarnings = () => {
  return (
    <Content>
      <Spacer size="xl" />
      <Container>
        <EarningBox>
          <HeadSplit>
            <CoinIcon src={getCoinIconUrl('eth')} />
            <HeadContent>
              <h2>Ethereum</h2>
              <p>Estimated daily earnings mining with Flexpool</p>
            </HeadContent>
          </HeadSplit>
          <IntervalContainer>
            <IntervalItem>
              <p>100 MH/s daily</p>
              <FiatValue>$9.25</FiatValue>
              <p>0.00445 ETH</p>
            </IntervalItem>
            <IntervalItem>
              <p>100 MH/s monthly</p>
              <FiatValue>${9.25 * 30.5}</FiatValue>
              <p>0.00445 ETH</p>
            </IntervalItem>
            <StartMiningContainer>
              <Button variant="success">Start mining</Button>
            </StartMiningContainer>
          </IntervalContainer>
        </EarningBox>
        <EarningBox>
          <HeadSplit>
            {/* <CoinIcon src={getCoinIconSrc('zec')} /> */}
            <UnknownCoin>
              <FaRocket />
            </UnknownCoin>
            <HeadContent>
              <h2>More coins to mine soon!</h2>
              <p>
                We are preparing to launch multiple pools in the nearest future.
                Stay connected with us to be there when the next altcoin hits
                Flexppol!
              </p>
            </HeadContent>
          </HeadSplit>
          <IntervalContainer>
            <IntervalItem></IntervalItem>
            <StartMiningContainer>
              <Button variant="warning">Join Our Discord</Button>
            </StartMiningContainer>
          </IntervalContainer>
        </EarningBox>
      </Container>
    </Content>
  );
};

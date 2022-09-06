import styled from 'styled-components';
import { Img } from 'src/components/Img';

export const UnknownCoin = styled.div`
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  svg {
    height: 45%;
    width: 45%;
  }
  img {
    max-height: 80%;
    max-width: 80%;
  }
`;

export const CoinIcon = styled(Img)`
  width: 60px;
  height: 60px;
`;

export const EarningBox = styled.div`
  color: white;
  p,
  h2,
  span {
    color: var(--text-on-bg);
  }
  background: rgba(86, 86, 86, 0.1);
  border-radius: 5px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(5px);
`;

export const Container = styled.div`
  display: flex;
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

export const HeadContent = styled.div`
  margin-left: 1rem;
  p {
    margin-top: 0.25rem;
  }
`;
export const HeadSplit = styled.div`
  display: flex;
  align-items: center;
  & > *:first-child {
    flex-shrink: 0;
  }
  & > *:last-child {
    margin-top: 0.25rem;
  }
  @media screen and (max-width: 540px) {
    flex-direction: column;
    align-items: center;
    text-align: center;

    ${HeadContent} {
      margin-left: 0;
    }
  }
`;

export const FiatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

export const CryptoValue = styled.p`
  margin: 0 0 0 0.25rem;
`;

export const IntervalItem = styled.div`
  p {
    margin-top: 0.25rem;
  }
  flex-grow: 1;
  @media screen and (max-width: 540px) {
    justify-content: center;
    text-align: center;
  }
`;

export const IntervalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  flex-wrap: wrap;
  margin-left: -1rem;
  margin-right: -1rem;
  & > * {
    margin-left: 1rem;
    margin-right: 1rem;
    padding-top: 1.5rem;
  }

  ${IntervalItem}:first-child {
    padding-top: 10px;
  }
`;

export const EstimatedNumbers = styled.div`
  display: flex;
  margin-top: 0.2rem;
  align-items: center;

  @media screen and (max-width: 540px) {
    justify-content: center;
  }
`;

export const StartMiningContainer = styled.div`
  margin-top: 1.25rem;
  display: flex;
  align-items: center;
  flex-grow: 1;

  & > button {
    margin-left: auto;
  }

  @media screen and (max-width: 540px) {
    justify-content: center;
    & > button {
      margin-left: 0;
    }
  }
  & > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

export const PoolDetails = styled.div`
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 540px) {
    text-align: center;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: -0.5rem;
  & > * {
    margin: 0.5rem;
  }
`;
export const Desc = styled.div`
  line-height: 1.4;
  margin-top: 0;
`;

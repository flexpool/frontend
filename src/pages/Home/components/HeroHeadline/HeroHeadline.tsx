import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import useInterval from '@/hooks/useInterval';
import useIsMounted from '@/hooks/useIsMounted';
import { Trans } from 'next-i18next';
import { mineableCoins } from '@/pages/GetStarted/mineableCoinList';

const ScrollTextContainer = styled.div`
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: 83%;
  font-size: inherit;
  vertical-align: top;
  min-width: 230px;
  white-space: nowrap;
  color: var(--primary);

  @media screen and (min-width: 800px) {
    min-width: 510px;
  }
`;

const appear = keyframes`
 0% {
    transform: translateY(100%);
  }

  50% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(0);
  }
`;

const TextAppear = styled.span`
  position: relative;
  display: block;
  top: 0;
  animation: ${appear} 2.5s ease-in-out;
`;

const disappear = keyframes`
    0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-100%);
    opacity: 0;
  }

  70% {
    transform: translateY(-100%);
    opacity: 0;
  }

  100% {
    transform: translateY(-100%);
    opacity: 0;
  }  
`;

const TextDisappear = styled.span`
  position: absolute;
  display: block;
  top: 0;
  animation: ${disappear} 2.5s ease-in-out;
`;

const list = mineableCoins
  .map((coin) => ({
    name: coin.name,
  }))
  .filter((s) => !s.name.toLowerCase().includes('testnet'));

const COINS_COUNT = list.length;

const HeroHeadLineContainer = styled.div`
  font-size: 2rem;
  line-height: 1.4;
  font-weight: 700;
  color: white;
  line-height: 2.75rem;
  letter-spacing: -0.02em;

  @media screen and (min-width: 800px) {
    font-size: 3.5rem;
    line-height: 4.2rem;
  }
`;

const HeroHeadline = () => {
  const [count, setCount] = useState(0);
  const isMounted = useIsMounted();

  useInterval(() => {
    setCount((c) => {
      return (c + 1) % COINS_COUNT;
    });
  }, 2500);

  return (
    <HeroHeadLineContainer>
      <Trans />
      <Trans
        i18nKey="title"
        ns="home"
        components={{
          br: <br />,
        }}
      />{' '}
      <ScrollTextContainer>
        {isMounted ? (
          <>
            <TextDisappear key={count - 1}>
              {list[(COINS_COUNT + (count - 1)) % COINS_COUNT].name}
            </TextDisappear>
            <TextAppear key={count}>{list[count].name}</TextAppear>
          </>
        ) : (
          <span>{list[COINS_COUNT - 1].name}</span>
        )}
      </ScrollTextContainer>
    </HeroHeadLineContainer>
  );
};

export default React.memo(HeroHeadline);

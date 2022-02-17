import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import useInterval from '@/hooks/useInterval';

const ScrollTextContainer = styled.div`
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: 80%;
  font-size: inherit;
  vertical-align: top;
  min-width: 230px;

  @media screen and (min-width: 800px) {
    min-width: 530px;
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

const TextAppear = styled.span<{ color: string }>`
  position: relative;
  display: block;
  top: 0;
  color: ${(props) => props.color};
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

const TextDisappear = styled.span<{ color: string }>`
  position: absolute;
  display: block;
  top: 0;
  animation: ${disappear} 2.5s ease-in-out;
  color: ${(props) => props.color};
`;

const list = [
  {
    name: 'Ethereum',
    color: '#868ead',
  },
  {
    name: 'Ethereum Classic',
    color: '#38b239',
  },
  {
    name: 'Chia',
    color: '#3AAB59',
  },
];

const HeroHeadLineContainer = styled.div`
  font-size: 2rem;
  line-height: 1.4;
  font-weight: 400;
  color: white;

  @media screen and (min-width: 800px) {
    font-size: 3.5rem;
  }
`;

const HeroHeadline = () => {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount((c) => {
      return (c + 1) % 3;
    });
  }, 2500);

  return (
    <HeroHeadLineContainer>
      Building the future of mining pools <br />
      for{' '}
      <ScrollTextContainer>
        <TextDisappear
          key={count - 1}
          color={list[(3 + (count - 1)) % 3].color}
        >
          {list[(3 + (count - 1)) % 3].name}
        </TextDisappear>
        <TextAppear key={count} color={list[count].color}>
          {list[count].name}
        </TextAppear>
      </ScrollTextContainer>
    </HeroHeadLineContainer>
  );
};

export default HeroHeadline;

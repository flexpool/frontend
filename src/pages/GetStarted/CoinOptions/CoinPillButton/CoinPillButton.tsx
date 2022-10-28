import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';

const StyledButton = styled.button`
  all: unset;
  position: relative;
  cursor: pointer;
  border-radius: 34px;
  padding: 9px 14px;
  font-weight: 500;
  font-size: 15px;

  display: inline-flex;
  align-items: center;

  & > span {
    opacity: 0.5;
    color: var(--text-primary);
  }

  &[data-selected='true'] > span {
    opacity: 1;
    color: var(--text-primary);
  }

  &:hover > span {
    opacity: 1;
    color: var(--text-primary);
  }
`;

const Highlight = styled(motion.div)`
  position: absolute;
  height: 50px;
  width: 100%;
  background-color: var(--border-color);
  z-index: -1;
  border-radius: 50px;
  left: 0;
`;

type Coin = {
  ticker: string;
  name: string;
};

const ButtonIcon = styled.div`
  height: 20;
  width: 20;
  margin-right: 5px;
`;

export const CoinPillButton = ({
  coin,
  selected,
}: {
  coin: Coin;
  selected: Boolean;
}) => {
  return (
    <StyledButton data-selected={selected}>
      {selected && (
        <Highlight
          layoutId="highlight"
          transition={{
            layout: {
              duration: 0.3,
              ease: 'easeOut',
            },
          }}
        />
      )}

      <ButtonIcon>
        <Image
          alt={`${coin?.name} icon`}
          width={20}
          height={20}
          src={getCoinIconUrl(coin?.ticker, 'small')}
        />
      </ButtonIcon>

      <span>{coin.name}</span>
    </StyledButton>
  );
};

export default CoinPillButton;

import React from 'react';
import { Img } from '@/components/Img';

type FlagShape = 'square' | 'round';

type FlagProps = {
  countryCode: string;
  shape?: FlagShape;
};

const borderRadius: { [key in FlagShape]: string } = {
  square: '0px',
  round: '5px',
};

const getBorderRadius = (shape: FlagShape) => {
  return borderRadius[shape] || borderRadius.square;
};

export const Flag = ({ countryCode, shape = 'square' }: FlagProps) => {
  return (
    <Img
      src={`https://static.flexpool.io/assets/countries/${countryCode}.svg`}
      style={{
        width: shape === 'square' ? '32px' : '34px',
        height: shape === 'square' ? 'auto' : '23px',
        objectFit: 'cover',
        objectPosition: 'center',
        marginRight: '10px',
        borderRadius: getBorderRadius(shape),
      }}
      alt={countryCode}
    />
  );
};

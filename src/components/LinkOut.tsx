import React from 'react';
import { CoinLinkType, getCoinLink } from 'src/utils/coinLinks.utils';
import { stringUtils } from 'src/utils/string.utils';

/**
 * external link with target="_blank" and rel="noopener noreferrer"
 * @param param0
 * @returns
 */
export const LinkOut: React.FC<JSX.IntrinsicElements['a']> = ({
  children,
  ...props
}) => {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export const LinkOutCoin: React.FC<{
  hash: string;
  coin?: string;
  children?: React.ReactNode;
  hashLength?: number;
  type: CoinLinkType | 'orphan';
}> = ({ hash, coin, type, children, hashLength = 8 }) => {
  if (!coin) {
    return <>{children}</>;
  }

  if (type === 'orphan') {
    return <>{stringUtils.shortenString(hash, hashLength)}</>;
  }

  const href = getCoinLink(type, hash, coin);

  const childContent = children || stringUtils.shortenString(hash, hashLength);

  if (href) {
    return <LinkOut href={href}>{childContent}</LinkOut>;
  }
  return <>{childContent}</>;
};

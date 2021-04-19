import React from 'react';

type ImageProps = JSX.IntrinsicElements['img'] & {
  alt: string;
  loading?: string;
};

/**
 * forces usage of alt
 * adds loading=laze by default
 */
export const Img = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ alt, loading = 'lazy', ...rest }, ref) => (
    <img alt={alt} {...rest} ref={ref} />
  )
);

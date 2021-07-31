import React from 'react';

type ImageProps = JSX.IntrinsicElements['img'] & {
  alt: string;
  loading?: string;
};

/**
 * forces usage of alt
 * adds loading=laze by default
 */
// TODO: Swap using this component for Next/Image component
export const Img = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ alt, loading = 'lazy', ...rest }, ref) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...rest} ref={ref} />
  )
);

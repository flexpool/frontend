import {
  OverlayWithin,
  OverlayWithinOpacity,
} from 'src/components/OverlayWithin';
import React from 'react';
import { LoaderSpinner } from './LoaderSpinner';

/**
 * renders loading overlay within a container
 * make sure the container is position:relative
 */
export const LoaderOverlayWithin = ({
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof OverlayWithin>) => (
  <OverlayWithin {...rest}>
    <OverlayWithinOpacity />
    <LoaderSpinner />
    {children}
  </OverlayWithin>
);

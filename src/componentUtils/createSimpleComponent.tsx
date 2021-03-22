// for components that just needs styling

import React from 'react';

import { clx } from 'src/utils/clx';

/**
 * string or react component
 */
export type AnyTag =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export type ComponentProps = React.PropsWithChildren<{
  className?: string;
}>;

export const createComponent = <T extends AnyTag>(
  Component: T,
  baseClassName: string = '',
  defaultProps: Partial<React.ComponentProps<T>> = {}
): React.FC<React.ComponentProps<T>> => {
  const { objectProperties, ...defProps } = defaultProps;
  const SimpleComponent = (props: React.ComponentProps<T>) => {
    const nextProps: React.ComponentProps<T> = {
      ...defProps,
      ...props,
      className: clx(baseClassName, props.className),
    };

    return <Component {...nextProps} />;
  };

  return SimpleComponent;
};

// div
createComponent.div = (
  className: string,
  defaultProps?: Partial<JSX.IntrinsicElements['div']>
) => createComponent('div', className, defaultProps);

// span
createComponent.span = (
  className: string,
  defaultProps?: Partial<JSX.IntrinsicElements['span']>
) => createComponent('span', className, defaultProps);

createComponent.p = (
  className: string,
  defaultProps?: Partial<JSX.IntrinsicElements['p']>
) => createComponent('p', className, defaultProps);

export const crc = createComponent;

import React from 'react';
import { clx } from 'src/utils/clx';
// import './burger.scss';

export const Burger: React.FC<
  JSX.IntrinsicElements['div'] & { isOpen: boolean }
> = ({ className, isOpen, ...rest }) => {
  return (
    <div
      className={clx('burger', 'burger-slip', className, {
        open: isOpen,
      })}
      {...rest}
    >
      <div className="burger-lines" />
    </div>
  );
};

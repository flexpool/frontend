import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import cls from './modal.module.scss';
import { clx } from 'src/utils/clx';

export type OverlayControlProps = {
  isOpen?: boolean;
  portalEl?: HTMLElement | null;
  mobileFull?: boolean;
  desktopFull?: boolean;
};

export type OverlayProps = OverlayControlProps & {
  children?: React.ReactNode;
};

const bodyEl = typeof document !== 'undefined' ? document.body : null;

export const Overlay = (props: OverlayProps) => {
  const {
    isOpen,
    children,
    portalEl = bodyEl,
    mobileFull,
    desktopFull,
  } = props;

  if (!!portalEl) {
    return ReactDOM.createPortal(
      <CSSTransition in={isOpen} timeout={50} unmountOnExit>
        <div
          className={clx(cls['overlay'], {
            [cls.mobileFull]: mobileFull,
            [cls.desktopFull]: desktopFull,
          })}
        >
          {children}
        </div>
      </CSSTransition>,
      portalEl
    );
  }
  return null;
};

export default Overlay;

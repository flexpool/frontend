import React from 'react';
import { Overlay, OverlayControlProps } from './Overlay';

import cls from './modal.module.scss';
import { clx } from 'src/utils/clx';
import { OpenStateControls } from 'src/hooks/useOpenState';
import { OuterEvent, OuterEventProps } from '../DivOuterEvents';
import { Button } from '../Button';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components/macro';

export type ModalStateControls = OpenStateControls['modalProps'];
export type ModalProps = ModalStateControls &
  Omit<OuterEventProps, 'onOuterEvent'> &
  OverlayControlProps & {
    size?: 'lg' | 'sm' | 'xs' | 'xl';
    full?: boolean;
    hideCloseButton?: boolean;
    disablePortal?: boolean;
    closeOnOuterClick?: boolean;
    mobileFull?: boolean;
    handleOpen?: any;
    handleToggle?: any;
    autoWidth?: boolean;
    isLoading?: boolean;
    desktopFull?: boolean;
  };

export const Modal = (props: ModalProps) => {
  const {
    isOpen,
    handleClose,
    size = 'regular',
    full,
    children,
    className,
    hideCloseButton = false,
    portalEl,
    disablePortal = false,
    closeOnOuterClick,
    mobileFull,
    handleOpen,
    handleToggle,
    autoWidth,
    isLoading,
    desktopFull,
    ref,
    ...rest
  } = props;

  const el = (
    <OuterEvent
      className={clx(cls['modal'], className, {
        [cls[size]]: size,
        [cls['full']]: full,
        [cls.mobileFull]: mobileFull,
        [cls.autoWidth]: autoWidth,
        [cls.hasCloseButton]: !hideCloseButton,
        [cls.desktopFull]: desktopFull,
      })}
      onOuterEvent={closeOnOuterClick ? handleClose : undefined}
      {...rest}
    >
      {handleClose && !hideCloseButton && (
        <Button
          onClick={handleClose}
          name="close"
          aria-label="Close"
          className={cls['modal-btn-close']}
        >
          <FaTimes />
        </Button>
      )}
      {children}
    </OuterEvent>
  );

  if (disablePortal) {
    return el;
  }
  return (
    <Overlay
      isOpen={isOpen}
      portalEl={portalEl}
      mobileFull={mobileFull}
      desktopFull={desktopFull}
    >
      {el}
    </Overlay>
  );
};

Modal.displayName = 'Modal';
Modal.Header = styled.div`
  padding: 1.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
Modal.Body = styled.div`
  padding: 1.5rem 1.5rem;
  &:not(:first-child) {
    border-top: 1px solid var(--border-color);
  }
`;

export default Modal;

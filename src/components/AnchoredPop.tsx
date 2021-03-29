import React from 'react';
import ReactDOM from 'react-dom';
import { PropsOf } from 'src/types/ReactHelp.types';
import styled from 'styled-components/macro';
import { OuterEvent } from 'src/components/DivOuterEvents';

const bodyEl = typeof document !== 'undefined' ? document.body : null;

const PopEl = styled(OuterEvent)`
  position: fixed;
  transition: 0.2s all;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  z-index: 10000;

  ${(p: { visible?: boolean }) =>
    p.visible &&
    `
    transform: translateY(0);
    visibility: visible;
    opacity: 1;
  `}
`;

export type AnchoredPopProps = PropsOf<typeof PopEl> & {
  anchorEl?: HTMLElement | null;
  visible?: boolean;
  position?: ['top' | 'bottom' | 'center', 'left' | 'right' | 'center'];
  /**
   * vertical, horizontal
   */
  offset?: [number, number];
};

export const AnchoredPop: React.FC<AnchoredPopProps> = ({
  anchorEl,
  style,
  visible,
  onOuterEvent,
  position = ['bottom', 'right'],
  offset = [4, 0],
  ...rest
}) => {
  const [anchorRect, setAnchorRect] = React.useState<DOMRect>();
  const popElRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const setAnchorPosition = () => {
      if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        setAnchorRect(rect);
      } else {
        setAnchorRect(undefined);
      }
    };

    setAnchorPosition();

    window.addEventListener('scroll', setAnchorPosition);
    return () => {
      window.removeEventListener('scroll', setAnchorPosition);
    };
  }, [anchorEl]);

  const popPosition = React.useMemo(() => {
    if (!anchorRect || !popElRef.current) {
      return {};
    }

    const {
      height: popHeight,
      width: popWidth,
    } = popElRef.current.getBoundingClientRect();

    let top = anchorRect.y;
    let left = anchorRect.x;

    const fitsToBottom =
      top + popHeight + anchorRect.height < window.innerHeight;
    const fitsToTop = top - popHeight > 0;

    const posTop =
      position[0] === 'top'
        ? fitsToTop
          ? 'top'
          : 'bottom'
        : position[0] === 'bottom'
        ? fitsToBottom
          ? 'bottom'
          : 'top'
        : 'center';

    switch (posTop) {
      case 'bottom': {
        top += anchorRect.height + offset[0];
        break;
      }
      case 'top': {
        top -= popHeight + offset[0];
        break;
      }
      case 'center': {
        top = 0;
        break;
      }
    }
    switch (position[1]) {
      case 'left': {
        break;
      }
      case 'right': {
        left += anchorRect.width - popWidth;
        break;
      }
      case 'center': {
        left = 0;
        break;
      }
    }

    return {
      top,
      left,
    };
  }, [anchorRect, popElRef, position, offset]);

  if (!bodyEl) {
    return null;
  }

  return ReactDOM.createPortal(
    <PopEl
      style={{ ...style, ...popPosition }}
      visible={visible}
      onOuterEvent={visible ? onOuterEvent : undefined}
      allowedOuterEventEls={[anchorEl]}
      ref={popElRef}
      {...rest}
    />,
    bodyEl
  );
};

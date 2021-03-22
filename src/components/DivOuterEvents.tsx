import React from 'react';

export type OuterEventProps = JSX.IntrinsicElements['div'] & {
  onOuterEvent?: (e: Event) => void;
  allowedOuterEventEls?: (HTMLElement | null | undefined)[];
};
export const OuterEvent = React.forwardRef<HTMLDivElement, OuterEventProps>(
  (props, ref) => {
    const {
      children,
      onOuterEvent,
      allowedOuterEventEls = [],
      style,
      className,
    } = props;

    const rf = React.useRef<HTMLDivElement>(null);
    const elRef = ref || rf;

    React.useEffect(() => {
      const onOuterAction = (e: Event): void => {
        if ('current' in elRef && onOuterEvent && elRef.current) {
          for (const el of allowedOuterEventEls) {
            if (el && el.contains(e.target as any)) {
              return;
            }
          }
          if (elRef.current.contains(e.target as any)) {
            return;
          }
          onOuterEvent(e);
        }

        return;
      };

      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        document.addEventListener('click', onOuterAction);
      }

      return () => {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          document.removeEventListener('click', onOuterAction);
        }
      };
    }, [onOuterEvent, elRef, allowedOuterEventEls]);

    return (
      <div {...{ style, className }} ref={elRef}>
        {children}
      </div>
    );
  }
);

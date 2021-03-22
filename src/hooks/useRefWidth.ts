import debounce from 'lodash.debounce';
import React from 'react';

export const useRefBound = <E extends HTMLElement>(): [
  React.RefObject<E>,
  DOMRect | undefined
] => {
  const ref = React.useRef<E>(null);
  const [rect, setRect] = React.useState<DOMRect>();

  React.useLayoutEffect(() => {
    const onWindowResize = debounce(() => {
      if (ref?.current) {
        setRect(ref?.current.getBoundingClientRect());
      }
    }, 100);

    onWindowResize();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onWindowResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', onWindowResize);
      }
    };
  }, [ref]);

  return [ref, rect];
};

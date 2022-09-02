import { useEffect, useState, useRef, useCallback } from 'react';

type TypeWriterConfig = {
  enable: boolean;
  delete: boolean;
  speed: Number;
  isTyped: boolean;
  delay: number;
  onFinished: () => void;
};

const NOOP = () => {};

export const useTypewriter = (
  text: string,
  config: Partial<TypeWriterConfig>
) => {
  const cursor = useRef<number>(config.isTyped ? text.length : 0);

  const [enable, setEnable] = useState(config?.enable ?? true);

  if (config.enable !== enable) {
    setEnable(config.enable ?? true);
  }

  const [letters, setLetters] = useState(() => {
    if (config.isTyped) {
      return text;
    }
    return '';
  });

  const isTyped = useRef(cursor.current === text.length);

  const [isFinished, setIsFinished] = useState(false);

  const onFinishedCallbackRef = useRef(config.onFinished || NOOP);

  const timeoutId = useRef<any>();

  const tick = useCallback(() => {
    clearTimeout(timeoutId.current);

    let t = 150 - Math.random() * 100;

    if (!isTyped.current) {
      cursor.current += 1;
    } else if (config.delete) {
      cursor.current -= 1;
      t = t / 2;
    }

    setLetters(text.substring(0, cursor.current));

    if (cursor.current === text.length) {
      isTyped.current = true;
    }

    const reTick = () => {
      timeoutId.current = setTimeout(() => {
        tick();
      }, t);
    };

    if (isTyped.current) {
      if (config.delete) {
        if (cursor.current === 0) {
          setIsFinished(true);
          onFinishedCallbackRef.current();
        } else {
          reTick();
        }
      } else {
        setIsFinished(true);
        onFinishedCallbackRef.current();
      }
    } else {
      reTick();
    }
  }, [config.delete, text]);

  const start = () => {
    setTimeout(() => {
      tick();
    }, config.delay || 0);
  };

  useEffect(() => {
    if (enable && !isFinished) {
      setTimeout(() => {
        tick();
      }, config.delay || 0);

      return () => {
        clearTimeout(timeoutId.current);
      };
    }
  }, [enable, text, isFinished, config.delete, config.delay, tick]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  return {
    letters,
    start,
  };
};

export default useTypewriter;

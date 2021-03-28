import React from 'react';

export const useBoolState = (value: boolean = false) => {
  const [val, setVal] = React.useState(value);

  const handleToggle = React.useCallback(
    (e?: any) => {
      if (e) {
        e.preventDefault();
      }
      setVal(!val);
    },
    [val]
  );

  const handleTrue = React.useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    setVal(true);
  }, []);
  const handleFalse = React.useCallback(() => {
    setVal(false);
  }, []);

  return {
    value: val,
    handleToggle,
    handleTrue,
    handleFalse,
  };
};

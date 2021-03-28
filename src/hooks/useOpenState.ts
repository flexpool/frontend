import { useBoolState } from './useBoolState';

export type OpenStateControls = {
  isOpen: boolean;
  handleClose: () => void;
  handleOpen: (e?: any) => void;
  handleToggle: () => void;
  modalProps: {
    isOpen: boolean;
    handleClose: () => void;
  };
};

/**
 * just a naming wrap for useBoolState
 * @param defaultState
 */
export const useOpenState = (
  defaultState: boolean = false
): OpenStateControls => {
  const boolState = useBoolState(defaultState);
  return {
    isOpen: boolState.value,
    handleClose: boolState.handleFalse,
    handleOpen: (e) => {
      if (e) {
        e.stopPropagation();
      }
      boolState.handleTrue();
    },
    handleToggle: boolState.handleToggle,
    modalProps: {
      isOpen: boolState.value,
      handleClose: boolState.handleFalse,
    },
  };
};

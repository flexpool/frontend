import React, { useEffect, useRef, useState } from 'react';
import { useCombobox, UseComboboxProps } from 'downshift';
import { BaseFormFieldProps } from '../formikUtils';
import { SelectOption } from '../Select/Select';
import { FieldWrap } from '../FormWrap';
import {
  DropdownItem,
  SelectContainer,
  SelectOptionButton,
} from '../DownshiftSelect/components';
import styled from 'styled-components';

import { SelectButton } from '../Select/Select.components';
import { SText, FocusRing } from '../TextInput';

const ComboboxInput = styled(SText)`
  border-radius: 5px;
`;

const ComboboxInputWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  min-width: 180px;
  background-color: var(--bg-secondary);

  input {
    background: var(--bg-primary);
  }
`;

const ComboBox = styled.div<{ isOpen?: boolean }>`
  ${(p) =>
    !p.isOpen &&
    `
    display: none;
  `};

  margin: 0;
  background: var(--bg-secondary);
  ${(p) => p.theme.boxShadow};
  border: ${(p) => p.theme.border.default};
  padding: 10px;
  min-width: 200px;
  border-radius: 5px;
  margin-top: 5px;
  position: absolute;
  right: 0;
  z-index: 100;

  &.top {
    bottom: calc(100% + 5px);
  }

  &:focus-visible {
    outline: none;
  }

  scrollbar-gutter: stable;
`;

export const DropdownList = styled.ul<{ isOpen?: boolean }>`
  list-style-type: none;
  margin-top: 10px;
  max-height: 300px;
  overflow: auto;
  margin-right: -10px;
`;

type SelectComboboxProps = {
  disabled?: boolean;
} & UseComboboxProps<SelectOption> &
  BaseFormFieldProps;

export const SelectCombobox = (props: SelectComboboxProps) => {
  const { label, initialHighlightedIndex = -1, items: $items, ...rest } = props;

  const [items, setItems] = useState($items);

  const {
    inputValue,
    selectedItem,
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    setInputValue,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    getInputProps,
    getComboboxProps,
  } = useCombobox({
    items,
    defaultInputValue: '',
    initialInputValue: '',
    onInputValueChange({ inputValue }) {
      const res = $items.filter(
        (item) => !inputValue || item.value.includes(inputValue.toLowerCase())
      );

      return setItems(res);
    },
    itemToString(item) {
      return item ? item.value : '';
    },
    ...rest,
  });

  const selectContainerRef = useRef<HTMLDivElement>(null);
  const comboboxRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownListRef = useRef<HTMLElement>(null);

  React.useEffect(() => {
    const checkFlip = () => {
      const dropdownBottom =
        comboboxRef.current?.getBoundingClientRect().bottom || 0;

      // The dropdown bottom position if display at bottom
      const bottomPosition =
        selectContainerRef.current && comboboxRef.current
          ? selectContainerRef.current?.getBoundingClientRect().bottom +
            comboboxRef.current?.getBoundingClientRect().height
          : 0;

      if (isOpen) {
        bottomPosition > window.innerHeight ||
        dropdownBottom > window.innerHeight
          ? comboboxRef.current?.classList.add('top')
          : comboboxRef.current?.classList.remove('top');
      }
    };

    checkFlip();

    window.addEventListener('scroll', checkFlip);

    return () => {
      window.removeEventListener('scroll', checkFlip);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, setInputValue]);

  // Clear input field when closed
  useEffect(() => {
    if (isOpen === false && inputValue !== '') {
      setInputValue('');
    }
  }, [isOpen, inputValue, setInputValue]);

  return (
    <SelectContainer ref={selectContainerRef}>
      <FieldWrap {...props} {...getLabelProps()}>
        <SelectButton {...getToggleButtonProps()}>
          {selectedItem?.label}
        </SelectButton>
      </FieldWrap>

      <ComboBox {...getComboboxProps()} isOpen={isOpen}>
        <ComboboxInputWrapper>
          <FocusRing>
            <ComboboxInput
              placeholder="USD, HKD..."
              {...getInputProps({ ref: inputRef })}
            />
          </FocusRing>
        </ComboboxInputWrapper>

        <DropdownList {...getMenuProps({ ref: dropdownListRef })}>
          {isOpen && (
            <>
              {items.map((item, index) => {
                return (
                  <DropdownItem
                    key={`${item.value}-${index}`}
                    {...getItemProps({ index, item })}
                  >
                    <SelectOptionButton
                      size="sm"
                      active={selectedItem?.value === item.value}
                      highlighted={highlightedIndex === index}
                      value={item.value}
                    >
                      {item.label}
                    </SelectOptionButton>
                  </DropdownItem>
                );
              })}
            </>
          )}
        </DropdownList>
      </ComboBox>
    </SelectContainer>
  );
};

export default SelectCombobox;

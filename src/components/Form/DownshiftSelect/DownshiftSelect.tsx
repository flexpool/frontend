import React, { useRef } from 'react';
import { useSelect, UseSelectProps } from 'downshift';
import SVGArrow from '../Select/SVGArrow';
import { SelectOption } from '../Select/Select';
import { BaseFormFieldProps } from '../formikUtils';

import {
  SCSelectButton,
  Placeholder,
  SelectArrowSvg,
  DropdownList,
  DropdownItem,
  SelectContainer,
  SelectOptionButton,
} from './components';

type SelectButtonProps = {
  children: React.ReactNode;
  placeholder?: string;
  toggleButtonProps: any;
};

const SelectButton = React.forwardRef(
  ({ children, placeholder, ...rest }: SelectButtonProps, ref) => {
    return (
      <SCSelectButton ref={ref} {...rest}>
        {children || <Placeholder>{placeholder}</Placeholder>}
        <SelectArrowSvg>
          <SVGArrow />
        </SelectArrowSvg>
      </SCSelectButton>
    );
  }
);

type DownshiftSelectProps = UseSelectProps<SelectOption> & BaseFormFieldProps;

const DownshiftSelect = ({
  label,
  items,
  initialHighlightedIndex = -1,
  ...rest
}: DownshiftSelectProps) => {
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    selectedItem,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    itemToString: (item) => item?.value || '',
    items,
    initialHighlightedIndex,
    ...rest,
  });

  const selectContainerRef = useRef<HTMLElement>(null);
  const dropdownListRef = useRef<HTMLElement>(null);

  React.useEffect(() => {
    const checkFlip = () => {
      const dropdownHeight =
        selectContainerRef.current && dropdownListRef.current
          ? selectContainerRef.current?.getBoundingClientRect().bottom +
            dropdownListRef.current?.getBoundingClientRect().height
          : 0;

      if (isOpen) {
        dropdownHeight > window.innerHeight
          ? dropdownListRef.current?.classList.add('top')
          : dropdownListRef.current?.classList.remove('top');
      }
    };

    checkFlip();

    window.addEventListener('scroll', checkFlip);

    return () => {
      window.removeEventListener('scroll', checkFlip);
    };
  }, [isOpen]);

  return (
    <SelectContainer ref={selectContainerRef}>
      {label && <label {...getLabelProps()}>{label}</label>}
      <SelectButton {...getToggleButtonProps()}>
        {selectedItem?.label}
      </SelectButton>

      <DropdownList {...getMenuProps({ ref: dropdownListRef })} isOpen={isOpen}>
        {isOpen &&
          items.map((item, index) => (
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
          ))}
      </DropdownList>
    </SelectContainer>
  );
};

export default DownshiftSelect;

import React, { useRef } from 'react';
import { useSelect, UseSelectProps } from 'downshift';
import SVGArrow from '../Select/SVGArrow';
import { SelectOption } from '../Select/Select';
import { BaseFormFieldProps } from '../formikUtils';
import { FieldWrap } from '../FormWrap';
import { Field, FieldHookConfig, FieldProps } from 'formik';

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

const SelectButton = React.forwardRef<HTMLButtonElement, SelectButtonProps>(
  ({ children, placeholder, ...rest }, ref) => {
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

type DownshiftSelectProps = {
  disabled?: boolean;
} & UseSelectProps<SelectOption> &
  BaseFormFieldProps;

const DownshiftSelect = (props: DownshiftSelectProps) => {
  const { label, items, initialHighlightedIndex = -1, ...rest } = props;

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    selectedItem,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    initialHighlightedIndex,
    ...rest,
  });

  const selectContainerRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLElement>(null);

  React.useEffect(() => {
    const checkFlip = () => {
      const dropdownBottom =
        dropdownListRef.current?.getBoundingClientRect().bottom || 0;

      // The dropdown bottom position if display at bottom
      const bottomPosition =
        selectContainerRef.current && dropdownListRef.current
          ? selectContainerRef.current?.getBoundingClientRect().bottom +
            dropdownListRef.current?.getBoundingClientRect().height
          : 0;

      if (isOpen) {
        bottomPosition > window.innerHeight ||
        dropdownBottom > window.innerHeight
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
      <FieldWrap {...props} {...getLabelProps()}>
        <SelectButton {...getToggleButtonProps()}>
          {selectedItem?.label}
        </SelectButton>

        <DropdownList
          {...getMenuProps({ ref: dropdownListRef })}
          isOpen={isOpen}
        >
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
      </FieldWrap>
    </SelectContainer>
  );
};

export const DownshiftSelectField = (
  props: DownshiftSelectProps & (FieldHookConfig<string> | { name: string })
) => {
  return (
    <Field {...props}>
      {(formikProps: FieldProps<string>) => {
        const { field, form, meta } = formikProps;
        return (
          <DownshiftSelect
            {...props}
            {...formikProps}
            onSelectedItemChange={(changes) =>
              form.setFieldValue(props.name, changes.selectedItem?.value)
            }
            selectedItem={props.items.find(
              (item) => item.value === field.value
            )}
            errorMessage={meta.error}
          />
        );
      }}
    </Field>
  );
};

export default DownshiftSelect;

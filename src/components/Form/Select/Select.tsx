import { Field, FieldProps } from 'formik';
import React from 'react';
import { Button } from 'src/components/Button';
import { useBoolState } from 'src/hooks/useBoolState';
import { PropsOf } from 'src/types/ReactHelp.types';
import { BaseFormFieldProps, getInputProps } from '../formikUtils';
import { FieldWrap } from '../FormWrap';
import {
  DropdownList,
  SelectButton,
  SelectOptionButton,
} from './Select.components';

export type SelectOption = {
  label: React.ReactNode;
  value: string;
};

const SelectContext = React.createContext<{
  onSelect: React.MouseEventHandler<HTMLButtonElement>;
  selectedValue: string | null | undefined;
}>({
  onSelect: () => {},
  selectedValue: '',
});

const SelectOpt: React.FC<Omit<PropsOf<typeof Button>, 'onClick'>> = ({
  value,
  children,
  ...rest
}) => {
  const context = React.useContext(SelectContext);
  return (
    <SelectOptionButton
      size="sm"
      value={value}
      onClick={context.onSelect}
      active={`${context.selectedValue}` === `${value}`}
      {...rest}
    >
      {children}
    </SelectOptionButton>
  );
};

/**
 * Select component
 * @param props
 */

export type SelectOptions = BaseFormFieldProps & {
  options: SelectOption[];
  value?: SelectOption['value'] | undefined | null;
  onChange?: React.MouseEventHandler<HTMLButtonElement>;
  name?: string;
  disabled?: boolean;
};

export const Select: React.FC<SelectOptions & Partial<FieldProps<string>>> & {
  Option: typeof SelectOpt;
} = (props) => {
  const {
    placeholder,
    options,
    value,
    onChange,
    name,
    disabled,
  } = getInputProps(props);

  const btnRef = React.useRef<HTMLButtonElement>(null);
  const openState = useBoolState();

  const onSelectItem: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    openState.handleFalse();
    if (onChange) {
      onChange(event);
    }
  };

  const selectedOption = options.find((opt) => `${opt.value}` === `${value}`);
  const selectedValueLabel = selectedOption?.label;

  return (
    <SelectContext.Provider
      value={{ onSelect: onSelectItem, selectedValue: value }}
    >
      <FieldWrap {...props}>
        <SelectButton
          onClick={openState.handleToggle}
          ref={btnRef}
          placeholder={placeholder}
          disabled={disabled}
        >
          <>{selectedValueLabel}</>
        </SelectButton>
        {openState.value && !disabled && (
          <DropdownList
            onOuterEvent={openState.handleFalse}
            anchorEl={btnRef.current}
            visible={openState.value}
          >
            {options.map((opt) => (
              <SelectOpt key={opt.value} name={name} value={opt.value}>
                {opt.label}
              </SelectOpt>
            ))}
          </DropdownList>
        )}
      </FieldWrap>
    </SelectContext.Provider>
  );
};

Select.Option = SelectOpt;

export const SelectField: React.FC<
  SelectOptions & Partial<FieldProps<string>>
> = (props) => {
  return <Field component={Select} {...props} />;
};

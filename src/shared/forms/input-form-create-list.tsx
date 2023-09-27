import { FormGroupWrapper } from "asv-hlps-react";
import { KeyboardEventHandler, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

export type InputSelectTypes = {
  label;
  // options: { name: string; value: string }[];
  options: any[];
  selected;
  control;
  // handleSelected;
  vertical?: boolean;
  noLabel?: boolean;
  labelColSize?;
  requiredStar?: boolean;
  onChange;
  errors;
  name;
  labelProp?;
  valueProp?;
  formatOptionLabel?;
  formatLabel?;
  defaultValue?;
  className?;
  placeholder?;
  selectClassName?;
  isDisabled?;
};

const components = {
  DropdownIndicator: null,
};

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

const InputFormCreateList = ({
  label,
  options,
  selected,
  onChange,
  formatOptionLabel,
  formatLabel,
  control,
  errors,
  name,
  labelProp = "name",
  valueProp = "id",
  vertical = false,
  noLabel = false,
  labelColSize,
  requiredStar = true,
  defaultValue = null,
  className,
  selectClassName,
  placeholder,
  isDisabled,
}: InputSelectTypes) => {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<readonly Option[]>([]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue("");
        event.preventDefault();
    }
    onChange(value);
  };

  const handleChange = (newValue) => {
    setValue(newValue);

    onChange(value);
  };
  /* const handleInputChange = (newValue) => {
    console.log(newValue);
    setInputValue(newValue);
  }; */
  /* useEffect(() => {
    console.log(value);
    // onChange(value);
  }, [handleChange]); */

  return (
    <FormGroupWrapper
      label={label}
      name={name}
      vertical={vertical}
      noLabel={noLabel}
      requiredStar={requiredStar}
      labelColSize={labelColSize}
      className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CreatableSelect
            {...field}
            components={components}
            inputValue={inputValue}
            isClearable
            isMulti
            menuIsOpen={false}
            // onChange={(newValue) =>  setValue(newValue)}

            onChange={handleChange}
            onInputChange={(newValue) => setInputValue(newValue)}
            // onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            // placeholder="Type something and press enter..."
            value={value}
          />
        )}
      />
    </FormGroupWrapper>
  );
};

export default InputFormCreateList;

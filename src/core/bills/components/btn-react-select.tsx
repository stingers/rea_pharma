import React, { useState } from "react";
import Select from "react-select";

type TobType = {
  options: { label: any; value: string | number }[];
  onSelectedOption;
  isMulti?: boolean;
};

const BtnReactSelect = ({ options, onSelectedOption, isMulti }: TobType) => {
  const [selected, setSelected] = useState(null);
  const handleSelected = (option) => {
    setSelected(option);
    onSelectedOption(option);
  };
  return (
    <Select
      maxMenuHeight={100}
      menuPlacement="auto"
      isMulti={isMulti}
      options={options}
      value={options.find((obj) => obj.value === selected?.value)}
      onChange={handleSelected}
    />
  );
};

export default BtnReactSelect;

import React, { useState } from "react";
import AsyncSelect from "react-select/async";

import { Toastify } from "../helpers/Toastify";

type TobType = {
  httpService;
  onChange;
  url: string;
  labelProp?: string;
  valueProp?: string;
  isClearable?: boolean;
  filterOptions?;
};

const DisplayAsyncSelect = ({ httpService, onChange, url, isClearable, labelProp = "name", valueProp = "id" }: TobType) => {
  const [tob, setTob] = useState(null);
  const [tobs, setTobs] = useState([]);

  const loadOptions = async (inputText: string, callback: any) => {
    if (!inputText.trim() || inputText.length < 3) {
      return [];
    }
    try {
      const { data } = await httpService.search(inputText, url);
      // setTobs(data);
      return callback(
        data
        /* opts.map((tob) => {
          return { label: tob[labelProp], value: tob[valueProp] };
        }) */
      );
    } catch (error) {
      Toastify.error();
    }
  };
  const filterOptions = () => {};
  const handleChange = (data) => {
    onChange(data);
    setTob(data);
  };
  return (
    <AsyncSelect
      // components={makeAnimated()}
      placeholder={"Search ..."}
      loadOptions={loadOptions}
      getOptionLabel={(opt) => `${opt[labelProp]}`}
      getOptionValue={(opt) => `${opt[valueProp]}`}
      value={tob}
      onChange={(e) => handleChange(e)}
      isClearable={isClearable}
      // filterOption={filterOptions}
      // loadingMessage={"boubou"}
    />
  );
};

export default DisplayAsyncSelect;

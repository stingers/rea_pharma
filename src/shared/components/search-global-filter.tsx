import classNames from "classnames";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useAsyncDebounce } from "react-table";

interface GlobalFilterProps {
  preGlobalFilteredRows: any;
  globalFilter: any;
  setGlobalFilter: any;
  searchBoxClass?: any;
  onAsyncSearch?;
  resetValue?: boolean;
}

export const SearchGlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  searchBoxClass,
  onAsyncSearch,
  resetValue = false,
}: GlobalFilterProps) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState<any>(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  const handleAsyncSearch = (e) => {
    e.stopPropagation();
    if (value !== "") {
      onAsyncSearch(value);
    }
  };

  if (resetValue) {
    setValue("");
  }

  return (
    <div className={classNames(searchBoxClass)}>
      <span className="d-flex align-items-center">
        <input
          type="search"
          value={value || ""}
          onChange={(e: any) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          // placeholder={`${count} records...`}
          className="form-control react-table-search ms-1"
        />
        <Button variant="soft-primary" className="input-group-text" onClick={(e) => handleAsyncSearch(e)} type="button">
          <i className="uil uil-file-search-alt"></i>
        </Button>
      </span>
    </div>
  );
};

export default SearchGlobalFilter;

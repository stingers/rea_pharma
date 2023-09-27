import React, { useState } from "react";
import { Button } from "react-bootstrap";

type SearhBoxTypes = {
  // asynSearch?: string;
  // search?: string;
  onSearch: (search) => any;
  onAsyncSearch?: (search) => any;
};

const SearchBox: React.FC<SearhBoxTypes> = ({ onSearch, onAsyncSearch }) => {
  const [search, setSearch] = useState("");

  const sendSearch = (e) => {
    const query = e.currentTarget.value;
    setSearch(query);
    onSearch(query);
    // console.log(e.currentTarget.value);
  };

  const sendAsyncSearch = (e) => {
    if (search) {
      onAsyncSearch(search);
    }
  };

  return (
    <React.Fragment>
      <input
        type="text"
        className="form-control search-input"
        placeholder="Search..."
        value={search}
        // value={"vous"}
        // onChange={(e) => onSearch(e.currentTarget.value)}
        onChange={(e) => sendSearch(e)}
      />
      {/* <span className="uil uil-search icon-search"></span> */}
      <Button variant="soft-primary" className="input-group-text" onClick={sendAsyncSearch} type="button">
        <i className="uil uil-file-search-alt"></i>
      </Button>
    </React.Fragment>
  );
};

export default SearchBox;

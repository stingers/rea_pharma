import React from "react";
import { Route, Routes } from "react-router-dom";

import ListZut from "./list-zut";
import ZutIndex from "./zut-index";

const ZutRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<ZutIndex />}>
        <Route index element={<ListZut />} />
        <Route path="list" element={<ListZut />} />
      </Route>
    </Routes>
  );
};

export default ZutRouting;

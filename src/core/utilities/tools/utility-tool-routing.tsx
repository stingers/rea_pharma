import ListInsuranceCompany from "./insurances/list-insurance-company";
import UtilityToolIndex from "./utility-tool-index";
import React from "react";
import { Route, Routes } from "react-router-dom";

const UtilityToolRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<UtilityToolIndex />}>
        <Route index element={<ListInsuranceCompany />} />
        <Route path="insurances" element={<ListInsuranceCompany />} />
      </Route>
    </Routes>
  );
};

export default UtilityToolRouting;

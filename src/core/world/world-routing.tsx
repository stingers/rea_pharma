import React from "react";
import { Route, Routes } from "react-router-dom";

import ListCity from "./cities/ListCity";
import ListContinent from "./continents/list-continent";
import ListCountry from "./countries/list-country";
import ListDepartment from "./departments/list-department";
import ListQuarter from "./quarters/list-quarter";
import ListRegion from "./regions/list-region";
import WorldTool from "./world-tool";

const WorldRouting = () => {
  return (
    <Routes>
      {/* <Route index element={<WorldTool />} /> */}
      <Route element={<WorldTool />}>
        <Route index element={<ListContinent />} />
        <Route path="continents" element={<ListContinent />} />
        {/* <Route path="continents" element={<ListContinentTest />} /> */}
        <Route path="countries" element={<ListCountry />} />
        <Route path="cities" element={<ListCity />} />
        <Route path="regions" element={<ListRegion />} />
        <Route path="departments" element={<ListDepartment />} />
        <Route path="quarters" element={<ListQuarter />} />
      </Route>
    </Routes>
  );
};

export default WorldRouting;

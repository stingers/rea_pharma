import React, { Suspense } from "react";
import { Loader } from "react-bootstrap-typeahead";
import { Route, Routes } from "react-router-dom";

import Utility from "./utility-index";
import ListVehicle from "./vehicles/list-vehicle";

const UtilityToolRoutes = React.lazy(() => import("../utilities/tools/utility-tool-routing"));

const UtilityRouting = () => {
  return (
    <Routes>
      <Route path="" element={<Utility />}>
        <Route index element={<ListVehicle url="vehicles" />} />
        <Route path="vehicles" element={<ListVehicle url="vehicles" />} />
        <Route
          path="tools/*"
          element={
            <Suspense fallback={<Loader />}>
              <UtilityToolRoutes />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default UtilityRouting;

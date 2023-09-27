import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// ------ lazy routes ------
// const UserToolRoutes = React.lazy(() => import("../../../core/users/tools/user-tool-routing"));
const ProductToolRoutes = React.lazy(() => import("../../../core/stores/products/tools/product-tool-routing"));
const WorldRoutes = React.lazy(() => import("../../../core/world/world-routing"));
const BillToolRoutes = React.lazy(() => import("../../../core/bills/tools/bill-tool-routing"));
const DocuToolRoutes = React.lazy(() => import("../../../core/docus/tools/docu-tool-routing"));
const UtilityRoutes = React.lazy(() => import("../../../core/utilities/utility-routing"));

const ToolsRouting = () => {
  return (
    <Routes>
      {/* <Route index element={<ToolsIndex />} /> */}
      {/* <Route index element={<UserToolRoutes />} /> */}
      {/* <Route
        path="users/*"
        element={
          <Suspense fallback="">
            <UserToolRoutes />
          </Suspense>
        }
      /> */}
      <Route
        path="bills/*"
        element={
          <Suspense fallback="">
            <BillToolRoutes />
          </Suspense>
        }
      />
      <Route
        path="docus/*"
        element={
          <Suspense fallback="">
            <DocuToolRoutes />
          </Suspense>
        }
      />
      {/* <Route
        path="products/*"
        element={
          <Suspense fallback="">
            <ProductToolRoutes />
          </Suspense>
        }
      /> */}
      <Route
        path="utilities/*"
        element={
          <Suspense fallback="">
            <UtilityRoutes />
          </Suspense>
        }
      />
      <Route
        path="world/*"
        element={
          <Suspense fallback="">
            <WorldRoutes />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default ToolsRouting;

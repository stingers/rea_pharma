import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "../../shared/Loader";
import MemoStore from "./memo-store";
import ListProductInExpired from "./products/list-product-in-expired";
import ListMngDepot from "./products/mng-depots/list-mng-depot";
import StoreIndex from "./store-index";

const StoreRouting = () => {
  const ProductRoutes = React.lazy(() => import("../stores/products/product-routing"));
  const ProductToolRoutes = React.lazy(() => import("../stores/products/tools/product-tool-routing"));
  const ProductMvtRoutes = React.lazy(() => import("../stores/mvts/product-mvt-routing"));
  const BuyRoutes = React.lazy(() => import("../stores/buys/buy-routing"));
  return (
    <Routes>
      <Route path="/" element={<StoreIndex />}>
        <Route index element={<MemoStore />} />
        <Route path="memos" element={<MemoStore />} />
        <Route path="mngdepots" element={<ListMngDepot />} />
        <Route path="expired" element={<ListProductInExpired />} />
        <Route
          path="products/*"
          element={
            <Suspense fallback={<Loader />}>
              <ProductRoutes />
            </Suspense>
          }
        />
        <Route
          path="buys/*"
          element={
            <Suspense fallback={<Loader />}>
              <BuyRoutes />
            </Suspense>
          }
        />
        <Route
          path="productmvts/*"
          element={
            <Suspense fallback={<Loader />}>
              <ProductMvtRoutes />
            </Suspense>
          }
        />
        <Route
          path="producttools/*"
          element={
            <Suspense fallback={<Loader />}>
              <ProductToolRoutes />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default StoreRouting;

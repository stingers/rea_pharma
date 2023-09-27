import { Route, Routes } from "react-router-dom";

import ListProductInArrival from "../stores/products/lists/list-product-in-arrival";
import StatIndex from "./stat-index";
import StatSale from "./stat-sale";

const StatRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<StatIndex />}>
        <Route index element={<StatSale />} />
        <Route path="statsales" element={<StatSale />} />
        <Route path="agarrivals" element={<ListProductInArrival />} />
      </Route>
    </Routes>
  );
};

export default StatRouting;

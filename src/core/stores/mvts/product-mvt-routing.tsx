import React from "react";
import { Route, Routes } from "react-router-dom";

import ListProductAdjustment from "./adjustments/list-product-adjustment";
import ListProductIn from "./ins/list-product-in";
import ListProductInventory from "./inventories/list-product-inventory";
import ListProductMvt from "./list-product-mvt";
import ListProductOut from "./outs/list-product-out";
import ProductMvtIndex from "./product-mvt-index";
import ProductMvtMemos from "./product-mvt-memos";
import ListProductTransfert from "./transferts/list-product-transfert";

const ProductMvtRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductMvtIndex />}>
        <Route index element={<ProductMvtMemos />} />
        <Route path="memos" element={<ProductMvtMemos />} />
        <Route path="list" element={<ListProductMvt />}>
          <Route path=":mvt" element={<ListProductMvt />} />
          {/* <Route path="outs" element={<ListProductMvt />} /> */}
          {/* <Route path="ins" element={<ListProductMvt />} action={} /> */}
        </Route>
        <Route path="outs/:mvtId" element={<ListProductOut />} />
        <Route path="transferts/:mvtId" element={<ListProductTransfert />} />
        {/* <Route path="inventories/:mvtId" element={<ListProductInventory />} /> */}
        <Route path="inventory/:mvtId" element={<ListProductInventory />} />
        <Route path="adjustments/:mvtId" element={<ListProductAdjustment />} />
        <Route path="ins/:mvtId" element={<ListProductIn />} />
      </Route>
    </Routes>
  );
};

export default ProductMvtRouting;

import { Route, Routes } from "react-router-dom";

import ListProductOutAll from "../mvts/outs/list-product-out-all";
import ListSpQtityissue from "../sales/sale-products/list-sp-qtityissue";
import ListStatSpBack from "../sales/sale-products/list-stat-sp-back";
import ListProduct from "./lists/list-product";
import MemoProduct from "./memo-product";
import ProductBazar from "./product-bazar";
import ProductIndex from "./product-index";
import ListProductPromo from "./promos/list-product-promo";
import ListUgPromo from "./promos/list-ug-promo";

// const ProductToolRoutes = React.lazy(() => import("./tools/product-tool-routing"));
const ProductRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductIndex />}>
        <Route index element={<MemoProduct />} />
        <Route path="memos" element={<MemoProduct />} />
        <Route path="list" element={<ListProduct />} />
        <Route path="outalls" element={<ListProductOutAll />} />
        <Route path="statsaleproductbacks" element={<ListStatSpBack />} />
        <Route path="promougs" element={<ListUgPromo />} />
        <Route path="bazars" element={<ProductBazar />} />

        <Route path="promos" element={<ListProductPromo url="productpromos" />}>
          <Route path=":param" element={<ListProductPromo url={"productpromos"} />} />
        </Route>
        <Route path="qtityissues" element={<ListSpQtityissue url="spqtityissues" />}>
          <Route path=":status" element={<ListSpQtityissue url={"spqtityissues"} />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default ProductRouting;

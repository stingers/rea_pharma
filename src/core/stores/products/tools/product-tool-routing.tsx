import React from "react";
import { Route, Routes } from "react-router-dom";
import ListProductCat from "./cats/list-product-cat";
import ProductTool from "./product-tool-index";
import ListProductDci from "./dcis/list-product-dci";
import ListProductTclFrm from "./tcls/tcl-frms/list-product-tcl-frm";
import ListProductTclGrp from "./tcls/tcl-grps/list-product-tcl-grp";
import ListProductSof from "./sofs/list-product-sof";
import ListProductOutReason from "./out-reasons/list-product-out-reason";
import ListProductDos from "./doss/list-product-dos";
import ListProductDepot from "./depots/list-product-depot";
import ProductToolTcl from "./tcls/product-tool-tcl-index";
import ListProductFg from "./galenics/list-product-fg";
import ListProductLoc from "./locations/list-product-loc";

const ProductToolRouting = () => {
  return (
    <Routes>
      <Route path="" element={<ProductTool />}>
        <Route index element={<ListProductCat url="productcats" />} />
        <Route path="cats" element={<ListProductCat url="productcats" />} />
        <Route path="dcis" element={<ListProductDci url="productdcis" />} />
        <Route path="doss" element={<ListProductDos url="productdosages" />} />
        <Route path="locs" element={<ListProductLoc url="productlocs" />} />
        <Route path="fgs" element={<ListProductFg url="productfgalenics" />} />
        <Route path="tcls" element={<ProductToolTcl />}>
          <Route index element={<ListProductTclFrm url="producttcls" />} />
          <Route path="frms" element={<ListProductTclFrm url="producttcls" />} />
          <Route path="grps" element={<ListProductTclGrp url="producttclgrps" />} />
        </Route>
        <Route path="depots" element={<ListProductDepot url="productdepots" />} />
        <Route path="sofs" element={<ListProductSof url="productsofs" />} />
        <Route path="reasons" element={<ListProductOutReason url="product-out-reasons" />} />
        {/* <Route path="tcls" element={<ListProductTclFrm url="producttcls" />} /> */}
        <Route path="tclgrps" element={<ListProductTclGrp url="producttclgrps" />} />
      </Route>
    </Routes>
  );
};

export default ProductToolRouting;

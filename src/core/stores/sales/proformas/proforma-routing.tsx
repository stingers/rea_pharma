import { Route, Routes } from "react-router-dom";

import ListProductOnProforma from "./list-product-on-proforma";
import ListSaleProforma from "./list-sale-proforma";
import ProformaIndex from "./proforma-index";

const ProformaRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<ProformaIndex />}>
        <Route index element={<ListSaleProforma />} />
        {/* <Route path="memos" element={<ProformaMemo />} /> */}
        <Route path="list" element={<ListSaleProforma />} />
        <Route path="listproducts" element={<ListProductOnProforma />} />
      </Route>
    </Routes>
  );
};

export default ProformaRouting;

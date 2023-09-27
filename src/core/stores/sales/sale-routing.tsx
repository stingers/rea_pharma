import { Route, Routes } from "react-router-dom";

import GenBackSale from "./back/gen-back-sale";
import ListSaleBackNew from "./back/list-sale-back-new";
import ListSaleBackTreat from "./back/list-sale-back-treat";
import ListSaleDelivered from "./list-sale-delivered";
import SaleIndex from "./sale-index";

const SaleRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<SaleIndex />}>
        {/* <Route path="treatment" element={<ListSaleTreatment />} /> */}
        <Route index element={<ListSaleDelivered />} />
        <Route path="delivered" element={<ListSaleDelivered />} />
        <Route path="genSaleBack" element={<GenBackSale />} />
        <Route path="salesbacknew" element={<ListSaleBackNew />} />
        <Route path="salesbacktreat" element={<ListSaleBackTreat />} />
      </Route>
    </Routes>
  );
};

export default SaleRouting;

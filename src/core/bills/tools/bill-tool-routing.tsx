import { Route, Routes } from "react-router-dom";

import ListAccount from "./accounts/list-account";
import ListBank from "./banks/list-bank";
import BillTool from "./bill-tool-index";
import ListCurrency from "./currencies/list-currency";
import ListPaymentMode from "./modes/list-payment-mode";

const BillToolRouting = () => {
  return (
    <Routes>
      <Route path="" element={<BillTool />}>
        <Route index element={<ListCurrency url="currencies" />} />
        <Route path="accounts" element={<ListAccount url="accounts" />} />
        <Route path="banks" element={<ListBank url="banks" />} />
        <Route path="currencies" element={<ListCurrency url="currencies" />} />
        <Route path="modes" element={<ListPaymentMode url="billpaymentmodes" />} />
      </Route>
    </Routes>
  );
};

export default BillToolRouting;

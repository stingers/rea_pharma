import { Route, Routes } from "react-router-dom";

import ListBill from "../bills/list-bill";
import ListBillPayment from "../bills/payments/list-bill-payment";
import CashIndex from "./cash-index";
import ListDeposit from "./deposits/list-deposit";
import ListFeed from "./feeds/list-feed";
import ListBilan from "./list-bilan";
import ListSpent from "./spents/list-spent";

const CashRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<CashIndex />}>
        <Route index element={<ListBilan />} />
        <Route path="bilans" element={<ListBilan />} />
        <Route path="bills" element={<ListBill url="bills" />} />
        <Route path="spents" element={<ListSpent />} />
        <Route path="feeds" element={<ListFeed />} />
        <Route path="deposits" element={<ListDeposit />} />
        <Route path="payments" element={<ListBillPayment />} />
      </Route>
    </Routes>
  );
};

export default CashRouting;

import React, { Suspense } from "react";
import { Loader } from "react-bootstrap-typeahead";
import { Route, Routes } from "react-router-dom";

import BillIndex from "./bill-index";
import ListBill from "./list-bill";
import MemoBill from "./memo-bill";
import ListBillPayment from "./payments/list-bill-payment";
import ZutBill from "./bill-bazar";

const BillToolRoutes = React.lazy(() => import("./tools/bill-tool-routing"));

const BillRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<BillIndex />}>
        <Route index element={<MemoBill />} />
        <Route path="memos" element={<MemoBill />} />
        <Route path="zut" element={<ZutBill />} />
        <Route path="payments" element={<ListBillPayment />} />
        <Route path="list" element={<ListBill url={"bills"} />} />
        {/* <Route path="list" element={<ListBill url={"bills"} />}>
          <Route path=":status" element={<ListBill url={"bills"} />} />
        </Route> */}
        <Route
          path="tools/*"
          element={
            <Suspense fallback={<Loader />}>
              <BillToolRoutes />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default BillRouting;

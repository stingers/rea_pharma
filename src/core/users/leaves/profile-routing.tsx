import { Route, Routes } from "react-router-dom";

import ListBillPayment from "../../bills/payments/list-bill-payment";
import BillUser from "../cards/bill-user";
import StatUser from "../cards/stat-user";
import Profile from "../profiles/profile";
import ListLeave from "./list-leave";

const ProfileRouting = () => (
  <Routes>
    <Route path="" element={<Profile />}>
      <Route path="profilestat" element={<StatUser />} />
      <Route path="profilebills" element={<BillUser />} />
      <Route path="profilepayments" element={<ListBillPayment />} />
      <Route path="profileleaves" element={<ListLeave />} />
    </Route>
  </Routes>
);

/* const ProfileRouting = createRoutesFromElements(
  // <Route path="profile" element={<Profile />}>
  <Route path="" element={<Profile />}>
    <Route path="profilestat" element={<StatUser />} />
    <Route path="profilebills" element={<BillUser />} />
    <Route path="profilepayments" element={<ListBillPayment />} />
    <Route path="profileleaves" element={<ListLeave />} />
  </Route>
); */

export default ProfileRouting;

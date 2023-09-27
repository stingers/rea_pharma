import React, { Suspense } from "react";
import { Route, Routes } from "react-router";

import Loader from "../../shared/Loader";
import ListLeave from "./leaves/list-leave";
import ListUser from "./list-user";
import ListUserStatBill from "./list-user-stat-bill";
import ListUserStatSale from "./list-user-stat-sale";
import UserGrpIndex from "./user-grp-index";
// import MemoUser from "./memory-user";
import UserIndex from "./user-index";

const UserToolsRoutes = React.lazy(() => import("../users/tools/user-tool-routing"));
const MemoUser = React.lazy(() => import("./memo-user"));

const UserRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<UserIndex />}>
        <Route index element={<MemoUser />} />
        <Route path="memos" element={<MemoUser />} />
        {/* <Route path="carduser" element={<CardUser />} /> */}
        <Route path="grp/:code" element={<UserGrpIndex />}>
          <Route index element={<ListUser url={"users"} />} />
          <Route path="list" element={<ListUser url={"users"} />} />
          <Route path="leaves" element={<ListLeave />} />
          {/* <Route path="leaves" element={<ListLeave />}>
            <Route path=":status" element={<ListLeave />} />
          </Route> */}
          <Route path="userstatsales" element={<ListUserStatSale />} />
          <Route path="userstatbills" element={<ListUserStatBill />} />
        </Route>
        {/* <Route path="list" element={<ListUser url={"users"} />}>
          <Route path=":grp" element={<ListUser url={"users"} />}>
            <Route path="list" element={<ListUser url={"users"} />} />
          </Route>
        </Route> */}
        <Route
          path="tools/*"
          element={
            <Suspense fallback={<Loader />}>
              <UserToolsRoutes />
            </Suspense>
          }></Route>
      </Route>
    </Routes>
  );
};

export default UserRouting;

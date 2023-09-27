import React, { Suspense } from "react";
import { Loader } from "react-bootstrap-typeahead";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import Login from "../auth/Login";
import Logout from "../auth/Logout";
// import Register from "../auth/Register";
import Error404 from "../pages/error/Error404";

const DashRouting = React.lazy(() => import("../pages/dash/dash-routing"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Login />} />
      {/* <Route path="register" element={<Register />} /> */}
      <Route path="logout" element={<Logout />} />

      <Route
        path="dash/*"
        element={
          // <Suspense fallback={<Loader preloader />}>
          <Suspense fallback={<Loader />}>
            <DashRouting />
          </Suspense>
        }
      />
      <Route path="*" element={<Error404 />} />
    </Route>
  )
);

export default router;

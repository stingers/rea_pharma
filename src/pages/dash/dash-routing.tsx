import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import ListSaleTreatment from "../../core/stores/sales/list-sale-treatment";
import ListSaleProforma from "../../core/stores/sales/proformas/list-sale-proforma";
import ListShop from "../../core/stores/shops/list-shop";
import ListShopIndex from "../../core/stores/shops/list-shop-index";
import ShopCart from "../../core/stores/shops/shop-cart";
import ShopCartCheckout from "../../core/stores/shops/shop-cart-checkout";
import BillUser from "../../core/users/cards/bill-user";
import CardUser from "../../core/users/cards/card-user";
import StatUser from "../../core/users/cards/stat-user";
import ProfileRouting from "../../core/users/leaves/profile-routing";
import ListTask from "../../core/utilities/tasks/list-task";
import { useRedux } from "../../hooks";
import { LayoutTypes } from "../../layouts/constants/layout";
import DetachedLayout from "../../layouts/Detached";
import HorizontalLayout from "../../layouts/Horizontal";
import TwoColumnLayout from "../../layouts/TwoColumn";
import VerticalLayout from "../../layouts/Vertical";
import Loader from "../../shared/components/loader";
import Dash from "./Dash";
import Dashome from "./dash-home";
import DasPos from "./DasPos";

interface RoutesProps {}

// ------ lazy routes ------
const ToolsRoutes = React.lazy(() => import("./tools/tools-routing"));
const UsersRoutes = React.lazy(() => import("../../core/users/user-routing"));
const BillsRoutes = React.lazy(() => import("../../core/bills/bill-routing"));
const StoresRoutes = React.lazy(() => import("../../core/stores/store-routing"));
const ComptasRoutes = React.lazy(() => import("../../core/comptas/compta-routing"));
const CashsRoutes = React.lazy(() => import("../../core/cashs/cash-routing"));
const ProformasRoutes = React.lazy(() => import("../../core/stores/sales/proformas/proforma-routing"));
const SalesRoutes = React.lazy(() => import("../../core/stores/sales/sale-routing"));
const DocusRoutes = React.lazy(() => import("../../core/docus/docu-routing"));
const ZutRoutes = React.lazy(() => import("../../core/zut/zut-routing"));
const CakeRoutes = React.lazy(() => import("../../core/cakes/cake-routing"));
const DeliveriesRoutes = React.lazy(() => import("../../core/deliveries/delivery-routing"));
const StatRoutes = React.lazy(() => import("../../core/stats/stat-routing"));

// --------------------

const DashRouting = (props: RoutesProps) => {
  const { appSelector } = useRedux();
  const { layout } = appSelector((state) => ({
    layout: state.Layout,
  }));

  const getLayout = () => {
    let layoutCls = TwoColumnLayout;
    // let layoutCls = DetachedLayout;

    switch (layout.layoutType) {
      case LayoutTypes.LAYOUT_HORIZONTAL:
        layoutCls = HorizontalLayout;
        break;
      case LayoutTypes.LAYOUT_DETACHED:
        layoutCls = DetachedLayout;
        break;
      case LayoutTypes.LAYOUT_VERTICAL:
        layoutCls = VerticalLayout;
        break;
      default:
        layoutCls = TwoColumnLayout;
        break;
    }
    return layoutCls;
  };

  let Layout = getLayout();
  // let Layout = TwoColumnLayout;

  return (
    <>
      <Layout {...props}>
        <Routes>
          <Route path="/" element={<Dash />}>
            <Route index element={<Dashome />} />
            <Route path="home" element={<Dashome />} />
            <Route path="proformas" element={<ListSaleProforma />} />
            <Route path="treatment" element={<ListSaleTreatment />} />
            <Route path="shopcart" element={<ShopCart />} />
            <Route path="proformacart" element={<ShopCart />} />
            <Route path="checkout" element={<ShopCartCheckout />} />
            <Route path="proformacheckout" element={<ShopCartCheckout />} />
            <Route path="tasks" element={<ListTask />} />

            {/* <Route path="treatment" element={<ListSaleTreatment />} /> */}
            <Route path="carduser/:id" element={<CardUser />}>
              <Route index element={<StatUser />} />
              <Route path="userstat" element={<StatUser />} />
              <Route path="userbill" element={<BillUser clientId={null} />} />
            </Route>

            <Route path="profile/*" element={<ProfileRouting />} />

            {/* <Route path="carduser/:id" element={<CardUser />}>
              <Route path="userstat" element={<StatUser />} />
              <Route path="userbill" element={<BillUser />} />
            </Route> */}
            <Route path="pos" element={<DasPos />} />
            <Route path="shops" element={<ListShopIndex />}>
              <Route path="arrivals" element={<ListShop />} />
              <Route path=":param" element={<ListShop />} />
            </Route>
            <Route
              path="users/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <UsersRoutes />
                </Suspense>
              }
            />
            <Route
              path="stores/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <StoresRoutes />
                </Suspense>
              }
            />
            <Route
              path="stats/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <StatRoutes />
                </Suspense>
              }
            />
            <Route
              path="proformas/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <ProformasRoutes />
                </Suspense>
              }
            />
            <Route
              path="docus/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <DocusRoutes />
                </Suspense>
              }
            />
            <Route
              path="cashs/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <CashsRoutes />
                </Suspense>
              }
            />
            <Route
              path="cakes/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <CakeRoutes />
                </Suspense>
              }
            />
            <Route
              path="comptas/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <ComptasRoutes />
                </Suspense>
              }
            />

            <Route
              path="bills/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <BillsRoutes />
                </Suspense>
              }
            />
            <Route
              path="deliveries/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <DeliveriesRoutes />
                </Suspense>
              }
            />
            <Route
              path="sales/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <SalesRoutes />
                </Suspense>
              }
            />
            <Route
              path="zut/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <ZutRoutes />
                </Suspense>
              }
            />
            <Route
              path="tools/*"
              element={
                <Suspense fallback={<Loader preloader />}>
                  <ToolsRoutes />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </Layout>
    </>
  );
};

export default DashRouting;

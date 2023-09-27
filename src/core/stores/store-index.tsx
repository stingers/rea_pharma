import { IPath } from "asv-hlps";
import React from "react";

import DisplayTab from "../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: "stores_memos",
    title: <i className="fas fa-memory"></i>,
    icon: "uil-home-alt",
    link: "/dash/stores/memos",
  },
  {
    id: "stores_products",
    title: "produits",
    icon: "uil-home-alt",
    link: "/dash/stores/products",
  },
  {
    id: "stores_products_mvts",
    title: "mouvements",
    icon: "uil-home-alt",
    link: "/dash/stores/productmvts",
  },
  {
    id: "stores_products_depots",
    title: "depots",
    icon: "uil-home-alt",
    link: "/dash/stores/mngdepots",
  },
  {
    id: "stores_products_expired",
    title: "gestions des périmés",
    icon: "uil-home-alt",
    link: "/dash/stores/expired",
    state: "stores_products_expired",
  },
  {
    id: "stores_products_buy",
    title: "achats",
    icon: "uil-home-alt",
    link: "/dash/stores/buys",
  },
  {
    id: "stores_products_tools",
    title: <i className="fas fa-cogs"></i>,
    icon: "uil-home-alt",
    link: "/dash/stores/producttools",
    ms: true,
  },
];

const StoreIndex = () => {
  return <DisplayTab paths={paths} />;
};

export default StoreIndex;

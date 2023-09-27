import { IPath } from "asv-hlps";
import React from "react";

import DisplayTab from "../../../shared/displays/DisplayTab";

const ListShopIndex = () => {
  const paths: IPath[] = [
    {
      id: "shop_arrivals",
      title: "Nouvel arrivage",
      icon: "uil-home-alt",
      link: "/dash/shops/arrivals",
    },
    {
      id: "shop_promos",
      title: "promos",
      icon: "uil-home-alt",
      link: "/dash/shops/promos",
    },
    {
      id: "shop_cpas",
      title: "Gamme cpa",
      icon: "uil-home-alt",
      link: "/dash/shops/cpa",
    },
    {
      id: "shop_eqeers",
      title: "Gamme eqeer",
      icon: "uil-home-alt",
      link: "/dash/shops/eqeer",
    },
    {
      id: "shop_accessories",
      title: "accessoires",
      icon: "uil-home-alt",
      link: "/dash/shops/accessories",
    },
  ];
  return <DisplayTab paths={paths} pgTitle={"boutiques"} />;
};

export default ListShopIndex;

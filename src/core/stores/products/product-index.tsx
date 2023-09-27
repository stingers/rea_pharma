import DisplayTab from "../../../shared/displays/DisplayTab";
import { IPath } from "asv-hlps";

const paths: IPath[] = [
  {
    id: "stores_products_memos",
    title: <i className="fas fa-memory"></i>,
    icon: "uil-home-alt",
    link: "/dash/stores/products/memos",
  },
  {
    id: "stores_products_list",
    title: "liste",
    icon: "uil-home-alt",
    link: "/dash/stores/products/list",
  },

  {
    id: "stores_products_promos",
    title: "promos",
    icon: "uil-home-alt",
    link: "/dash/stores/products/promos",
  },
  {
    id: "stores_products_ug-promos",
    title: "gestion des ug",
    icon: "uil-home-alt",
    link: "/dash/stores/products/promougs",
  },
  {
    id: "stores_products_outs",
    title: "sorties",
    icon: "uil-home-alt",
    link: "/dash/stores/products/outalls",
  },
  {
    id: "stores_products_sp-qtityissues",
    title: "quantité non conforme",
    icon: "uil-home-alt",
    link: "/dash/stores/products/qtityissues/noTreat",
  },
  {
    id: "stores_products_stat-sp-backs",
    title: "stat sur les retours",
    icon: "uil-home-alt",
    link: "/dash/stores/products/statsaleproductbacks",
  },
  {
    id: "stores_products_bazars",
    title: "bazar",
    icon: "uil-home-alt",
    link: "/dash/stores/products/bazars",
    ms: true,
  },
];

const ProductIndex = () => {
  return <DisplayTab paths={paths} child />;
};

export default ProductIndex;

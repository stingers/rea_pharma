import { IPath } from "asv-hlps";

import DisplayTab from "../../../../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: "products_tools_tcls_frms",
    title: "frms",
    icon: "uil-home-alt",
    link: "/dash/stores/producttools/tcls/frms",
  },
  {
    id: "products_tools_tcls_grps",
    title: "grps",
    icon: "uil-home-alt",
    link: "/dash/stores/producttools/tcls/grps",
  },
];

const ProductToolTclIndex = () => {
  // return <p>coucou</p>;
  return <DisplayTab paths={paths} child />;
};

export default ProductToolTclIndex;

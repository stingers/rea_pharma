import { IPath } from "asv-hlps";
import { ADM, PHD } from "../../../../auth/services/auth-menu";
import authService from "../../../../auth/services/authService";
import DisplayTab from "../../../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: "products_tools_cats",
    title: "Catégories",
    icon: "uil-home-alt",
    link: "/dash/stores/producttools/cats",
    auth: authService.getAuth({ roles: PHD }),
  },
  {
    id: "products_tools_dcis",
    title: "dcis",
    icon: "uil-home-alt",
    link: "/dash/stores/producttools/dcis",
    auth: authService.getAuth({ roles: PHD }),
  },
  {
    id: "products_tools_depots",
    title: "depots",
    icon: "uil-home-alt",
    link: "/dash/stores/producttools/depots",
    auth: authService.getAuth({ roles: PHD }),
  },
  {
    id: "products_tools_doss",
    title: "dosages",
    icon: "uil-home-alt",
    link: "/dash/stores/producttools/doss",
    auth: authService.getAuth({ roles: ADM }),
  },
  {
    id: "products_tools_fgs",
    title: "formes galeniques",
    icon: "uil-home-alt",
    link: "/dash/stores/producttools/fgs",
    auth: authService.getAuth({ roles: PHD }),
  },
  {
    id: "products_tools_sof",
    title: "formats",
    icon: "uil-home-alt",
    link: "/dash/stores/producttools/sofs",
    auth: authService.getAuth({ roles: PHD }),
  },
  {
    id: "products_tools_tcls",
    title: "thérapeutiques",
    icon: "uil-home-alt",
    link: "/dash/stores/producttools/tcls",
    auth: authService.getAuth({ roles: PHD }),
  },
  {
    id: "products_tools_locs",
    title: "locations",
    icon: "uil-home-alt",
    link: "/dash/stores/producttools/locs",
    auth: authService.getAuth({ roles: PHD }),
  },
  {
    id: "products_tools",
    title: "raisons",
    icon: "uil-home-alt",
    link: "/dash/stores/producttools/reasons",
    auth: authService.getAuth({ roles: PHD }),
  },
];
const ProductToolIndex = () => {
  return <DisplayTab paths={paths} child />;
};

export default ProductToolIndex;

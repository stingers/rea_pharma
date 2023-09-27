import { IPath } from "asv-hlps";

import { PHD, TLM_COM } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import DisplayTab from "../../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: "sales_delivered",
    key: "sales_delivered",
    title: "Livrées",
    icon: "uil-home-alt",
    link: "/dash/sales/delivered",
    auth: authService.getAuth({
      tag: "cl",
      roles: [...PHD, ...TLM_COM, "rcm"],
      client: { roles: ["ceo"], steGrps: ["ph"] },
    }),
  },
  /* {
    id: "sales_back_new",
    key: "sales_back_new",
    title: "Retour en attente",
    icon: "uil-home-alt",
    link: "/dash/sales/salesbacknew",
    auth: authService.getAuth({
      tag: "gdr",
      roles: [...PHD, "rcm"],
      client: { roles: ["ceo"], steGrps: ["ph"] },
    }),
  }, */
  {
    id: "sales_back_treat",
    key: "sales_back_treat",
    title: "Retours",
    icon: "uil-home-alt",
    link: "/dash/sales/salesbacktreat",
    auth: authService.getAuth({
      tag: "gdr",
      roles: [...PHD, "rcm"],
      client: { roles: ["ceo"], steGrps: ["ph"] },
    }),
  },
];
const SaleIndex = () => {
  return <DisplayTab paths={paths} pgTitle={"commandes"} />;
};

export default SaleIndex;

import { IPath } from "asv-hlps";

import { CAISSE, COMPTA, PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import DisplayTab from "../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: "bills_memos",
    key: "bills_memos",
    title: <i className="fas fa-memory"></i>,
    icon: "uil-home-alt",
    link: "/dash/bills/memos",
    param: "bills_memos",
    state: { tabId: "bills_memos" },
    auth: authService.getAuth({ roles: [...PHD, ...CAISSE, ...COMPTA], client: { roles: ["ceo"] } }),
  },
  {
    id: "bills_status",
    title: "Factures",
    icon: "uil-home-alt",
    link: "/dash/bills/list",
  },
  {
    id: "bills_payments",
    key: "billpayments",
    title: "payments",
    icon: "uil-home-alt",
    link: "/dash/bills/payments",
    auth: authService.getAuth({ roles: [...CAISSE, ...COMPTA], client: { roles: ["ceo"] } }),
  },
  {
    id: "bills_bazars",
    key: "bills_bazars",
    title: "bazar",
    ms: true,
    icon: "uil-home-alt",
    link: "/dash/bills/zut",
    auth: authService.getAuth({ roles: [...CAISSE, ...COMPTA] }),
  },
  {
    id: "bills_tools",
    key: "bills_tools",
    title: <i className="fas fa-cogs"></i>,
    icon: "uil-home-alt",

    link: "/dash/bills/tools",
    auth: authService.getAuth({ roles: [...CAISSE, ...COMPTA] }),
  },
];
const BillIndex = () => {
  return <DisplayTab paths={paths} pgTitle={"facturation"} />;
};

export default BillIndex;

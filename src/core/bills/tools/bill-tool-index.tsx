import { IPath } from "asv-hlps";

import DisplayTab from "../../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: "bill_tool_accounts",
    title: "accounts",
    icon: "uil-home-alt",
    link: "/dash/bills/tools/accounts",
  },
  {
    id: "bill_tool_payment_mode",
    title: "mode payment",
    icon: "uil-home-alt",
    link: "/dash/bills/tools/modes",
  },
  {
    id: "bill_tool_currencies",
    title: "devises",
    icon: "uil-home-alt",
    link: "/dash/bills/tools/currencies",
  },
  {
    id: "bill_tool_banks",
    title: "banques",
    icon: "uil-home-alt",
    link: "/dash/bills/tools/banks",
  },
];

const BillToolIndex = () => {
  return <DisplayTab paths={paths} child />;
};

export default BillToolIndex;

import { IPath } from "asv-hlps";
import { TabContainer } from "asv-hlps-react";

import ListBillPayment from "../../bills/payments/list-bill-payment";
import ListSaleBackTreat from "../../stores/sales/back/list-sale-back-treat";
import SaleUser from "../../stores/sales/sale-user";
import BillUser from "./bill-user";
import CreditUser from "./credit-user";
import StatUser from "./stat-user";

/* interface TabType {
  id: number | string;
  title: string;
  icon?: string;
  auth?: boolean;
  Content: any;
} */

const CardUserModal = ({ userId, user }) => {
  const notInclus = ["ag", "fr", "la"];
  const tabContents: IPath[] = [
    {
      id: "stats_user",
      title: "stats",
      icon: "mdi mdi-chart-bar",
      Content: <StatUser userId={userId} />,
    },
    {
      id: "bills_user",
      title: "factures",
      icon: "mdi mdi-file-document-multiple",
      Content: <BillUser clientId={userId} />,
    },
    {
      id: "payments_user",
      title: "payments",
      icon: "mdi mdi-file-document-multiple",
      Content: <ListBillPayment userId={userId} />,
    },
    {
      id: "sales_user",
      title: "Commandes",
      icon: "mdi mdi-file-document-multiple",
      // Content: <SaleUser clientId={userId} />,
      Content: <SaleUser userId={userId} />,
      auth: !notInclus.includes(user?.ste?.grp?.code.toLocaleLowerCase()),
    },
    {
      id: "sales_back_user",
      title: "Retours",
      icon: "mdi mdi-file-document-multiple",
      // Content: <BillUser clientId={userId} />,
      Content: <ListSaleBackTreat userId={userId} />,
      auth: !notInclus.includes(user?.ste?.grp?.code.toLocaleLowerCase()),
    },
    {
      id: "big_book_user",
      title: "grand livre",
      icon: "mdi mdi-file-document-multiple",
      Content: <BillUser clientId={userId} />,
      auth: !notInclus.includes(user?.ste?.grp?.code.toLocaleLowerCase()),
    },
    {
      id: "id_user",
      title: "identification",
      icon: "mdi mdi-file-document-multiple",
      Content: <BillUser clientId={userId} />,
      auth: !notInclus.includes(user?.ste?.grp?.code.toLocaleLowerCase()),
    },
    {
      id: "credit_user",
      title: "credits",
      icon: "mdi mdi-file-document-multiple",
      Content: <CreditUser clientId={userId} />,
      auth: !notInclus.includes(user?.ste?.grp?.code.toLocaleLowerCase()),
    },
    {
      id: "escompte_user",
      title: "escomptes",
      icon: "mdi mdi-file-document-multiple",
      Content: <BillUser clientId={userId} />,
      auth: !notInclus.includes(user?.ste?.grp?.code.toLocaleLowerCase()),
    },
  ];
  return <TabContainer tabs={tabContents} defaultActiveKey={"stats_user"} />;
};

export default CardUserModal;

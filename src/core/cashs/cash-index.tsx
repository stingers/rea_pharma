import { IPath } from "asv-hlps";

import { CEO } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import DisplayTab from "../../shared/displays/DisplayTab";

const CashIndex = () => {
  //  const location = useLocation();
  const paths: IPath[] = [
    {
      id: "cash_bilan",
      title: "bilan",
      icon: "uil-home-alt",
      link: "./bilans",
      auth: authService.getAuth({ roles: [...CEO, "cai"] }),
    },
    {
      id: "cash_bills",
      title: "factures",
      icon: "uil-home-alt",
      link: "./bills",
      auth: authService.getAuth({ roles: [...CEO, "cai"] }),
    },
    {
      id: "cash_payments",
      title: "payments",
      icon: "uil-home-alt",
      link: "./payments",
      auth: authService.getAuth({ roles: [...CEO, "cai"] }),
    },
    {
      id: "cash_spents",
      title: "Sortie de caisse",
      icon: "uil-home-alt",
      link: "./spents",
      auth: authService.getAuth({ roles: [...CEO, "cai"] }),
    },
    {
      id: "cash_feeds",
      title: "Alimentation",
      icon: "uil-home-alt",
      link: "./feeds",
      auth: authService.getAuth({ roles: [...CEO, "cai"] }),
    },
    {
      id: "cash_deposits",
      title: "Depots",
      icon: "uil-home-alt",
      link: "./deposits",
      auth: authService.getAuth({ roles: [...CEO, "cai"] }),
    },
  ];

  return <DisplayTab paths={paths} />;
};

export default CashIndex;

import { IPath } from "asv-hlps/lib/cjs/models/types/Type";

import { PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import DisplayTab from "../../shared/displays/DisplayTab";

const StatIndex = () => {
  const paths: IPath[] = [
    {
      id: "stats_sales",
      title: !authService.getAuth({ steGrps: ["ph"] }) ? "ventes" : "achats",
      icon: "uil-home-alt",
      link: "/dash/stats",
    },
    {
      id: "stats_products_in_arrival",
      title: "arrivage",
      icon: "uil-home-alt",
      link: "/dash/stats/agarrivals",
      auth: authService.getAuth({ roles: [...PHD], steGrps: ["ag", "ph"] }),
    },
  ];
  return <DisplayTab paths={paths} />;
};

export default StatIndex;

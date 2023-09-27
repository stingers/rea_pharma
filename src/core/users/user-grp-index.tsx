import { IPath } from "asv-hlps";
import { useParams } from "react-router-dom";

import { PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import DisplayTab from "../../shared/displays/DisplayTab";

const UserGrpIndex = () => {
  const param = useParams();
  const paths: IPath[] = [
    {
      id: `users_grps_${param.code}_list`,
      title: "liste",
      icon: "uil-home-alt",
      link: "./list",
      // param: "cl",
    },

    {
      id: `users_grps_${param.code}_stats`,
      title: "stats ventes",
      icon: "uil-home-alt",
      link: "./userstatsales",
      auth: authService.getAuth({ roles: [...PHD] }),

      // param: "ph",
    },
    {
      id: `users_grps_${param.code}_stats-bills`,
      title: "stats factures",
      icon: "uil-home-alt",
      link: "./userstatbills",
      auth: authService.getAuth({ roles: [...PHD] }),

      // param: "ph",
    },
    /* {
      id: "users_leaves",
      title: "congés",
      icon: "uil-home-alt",
      link: "./leaves",
      // param: "cl",
      auth: authService.getAuth({ roles: [...PHD, "sec"] }),
    }, */
  ];

  const sfPaths: IPath[] = [
    ...paths,
    {
      id: `users_grps_${param.code}_leaves`,
      title: "congés",
      icon: "uil-home-alt",
      link: "./leaves",
      // param: "cl",
      auth: authService.getAuth({ roles: [...PHD, "sec"] }),
    },
  ];
  return <DisplayTab paths={param?.code === "sf" ? sfPaths : paths} child />;
};

export default UserGrpIndex;

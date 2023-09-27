import { IPath } from "asv-hlps";

import { COMPTA, PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import DisplayTab from "../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: "users_memos",
    title: <i className="fas fa-memory"></i>,
    icon: "uil-home-alt",
    link: "/dash/users/memos",
    // auth: authService.getAuth({ roles: [...PHD] }),
  },
  {
    id: "users_grps_cl",
    title: "clients",
    icon: "uil-home-alt",
    link: "/dash/users/grp/cl",
    auth: authService.getAuth({ roles: [...PHD, ...COMPTA, "cai", "rcm"] }),

    // param: "cl",
  },
  {
    id: "users_grps_ph",
    title: "pharmacies",
    icon: "uil-home-alt",
    link: "/dash/users/grp/ph",
    auth: authService.getAuth({ roles: [...PHD, ...COMPTA, "cai"] }),

    // param: "ph",
  },
  {
    id: "users_grps_ag",
    title: "agences",
    icon: "uil-home-alt",
    link: "/dash/users/grp/ag",
    auth: authService.getAuth({ roles: [...PHD, ...COMPTA] }),

    // param: "ag",
  },
  {
    id: "users_grps_fr",
    title: "fournisseurs",
    icon: "uil-home-alt",
    link: "/dash/users/grp/fr",
    auth: authService.getAuth({ roles: [...PHD, ...COMPTA] }),
  },
  {
    id: "users_grps_la",
    title: "laboratoires",
    icon: "uil-home-alt",
    link: "/dash/users/grp/la",
    auth: authService.getAuth({ roles: [...PHD, ...COMPTA] }),
    // param: "la",
  },
  {
    id: "users_grps_sf",
    title: "personnel",
    icon: "uil-home-alt",
    link: "/dash/users/grp/sf",
    auth: authService.getAuth({ tag: "staff", roles: [...PHD, "cpt"], client: { roles: ["ceo"] } }),
    // auth: authService.getAuth({ client: { roles: ["ceo"] } }),
    // param: "sf",
  },
  {
    id: "users_tools",
    title: <i className="fas fa-cogs"></i>,
    icon: "fas fa-cogs",
    link: "/dash/users/tools",
    ms: true,
    auth: authService.getAuth({ roles: [...PHD] }),
  },
];

const UserIndex = () => {
  return <DisplayTab paths={paths} pgTitle={"utilisateurs"} pgPath={"/dash"} />;
};

export default UserIndex;

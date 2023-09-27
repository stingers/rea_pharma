import { IPath } from "asv-hlps";

import { PHD } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import DisplayTab from "../../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: "users_tools_roles",
    title: "Roles",
    icon: "uil-home-alt",
    link: "/dash/users/tools/roles",
    state: { tabId: "users_tools", tabChildId: "users_tools_roles" },
    auth: authService.getAuth({ roles: PHD }),
  },
  {
    id: "users_tools_grps",
    title: "Groupes",
    icon: "uil-user",
    link: "/dash/users/tools/grps",
    // state: { tabId: "users_tools", tabChildId: "users_tools_grps" },

    auth: authService.getAuth({ roles: PHD }),
  },
  {
    id: "users_tools_ste_grps",
    title: "Sociétés groupes",
    icon: "uil-user",
    link: "/dash/users/tools/stegrps",
    // state: { tabId: "users_tools", tabChildId: "users_tools_ste-grps" },

    auth: authService.getAuth({ roles: PHD }),
  },
  {
    id: "users_tools_authtags",
    title: "AuthTags",
    icon: "uil-user",
    link: "/dash/users/tools/authtags",
    auth: authService.getAuth({ roles: PHD }),
    // state: { tabId: "users_tools", tabChildId: "users_tools_authtags" },
  },
  {
    id: "users_tools_authtags_cats",
    title: "AuthTags Cats",
    icon: "uil-user",
    link: "/dash/users/tools/authtagcats",
    auth: authService.getAuth({ roles: PHD }),
    // state: { tabId: "users_tools", tabChildId: "users_tools_authtags-cats" },
  },
  {
    id: "users_tools_zones",
    title: "zones",
    icon: "uil-user",
    link: "/dash/users/tools/zones",
    auth: authService.getAuth({ roles: PHD }),
    // state: { tabId: "users_tools", tabChildId: "users_tools_zones" },
  },
  {
    id: "users_tools_genders",
    title: "genders",
    default: true,
    icon: "uil-user",
    link: "/dash/users/tools/genders",
    auth: authService.getAuth({ roles: PHD }),
    // state: { tabId: "users_tools", tabChildId: "users_tools_genders" },
  },
  {
    id: "users_tools_titrs",
    title: "titres",
    default: true,
    icon: "uil-user",
    link: "/dash/users/tools/titrs",
    auth: authService.getAuth({ roles: PHD }),
    // state: { tabId: "users_tools", tabChildId: "users_tools_titrs" },
  },
];

const UserToolIndex = () => {
  return <DisplayTab paths={paths} child />;
};

export default UserToolIndex;

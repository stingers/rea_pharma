import { IPath } from "asv-hlps";

import { COMPTA, PHD } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import DisplayTab from "../../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: "ohada_subcats",
    link: "/dash/comptas/ohada/subcats",
    title: "Sub catégories",
    auth: authService.getAuth({ roles: [...PHD, ...COMPTA] }),
  },
  // { link: './entriedetails', title: 'Journal Détaillé', auth: {roles: ['adm', 'ceo', 'phd', 'cpt', 'acp']}},
  {
    id: "ohada_cats",
    link: "/dash/comptas/ohada/cats",
    title: "Catégories",
    auth: authService.getAuth({ roles: [...PHD, ...COMPTA] }),
  },
  {
    id: "ohada_grps",
    link: "/dash/comptas/ohada/grps",
    title: "Groupes",
    auth: authService.getAuth({ roles: [...PHD, ...COMPTA] }),
  },
  {
    id: "ohada_classes",
    link: "/dash/comptas/ohada/classes",
    title: "Classes",
    auth: authService.getAuth({ roles: [...PHD, ...COMPTA] }),
  },
];

const OhadaIndex = () => {
  return <DisplayTab paths={paths} child />;
};

export default OhadaIndex;

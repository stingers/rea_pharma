import { IPath } from "asv-hlps";

import { ADM } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import DisplayTab from "../../shared/displays/DisplayTab";

const ComptaIndex = () => {
  const paths: IPath[] = [
    {
      id: "compta_entries",
      link: "./entries",
      title: "Journaux",
      auth: authService.getAuth({ roles: [...ADM, "cpt", "acp"] }),
    },
    // { link: './entriedetails', title: 'Journal Détaillé', auth: {roles: ['adm', 'ceo', 'phd', 'cpt', 'acp']}},
    {
      id: "compta_balances",
      link: "./balances",
      title: "Balances",
      auth: authService.getAuth({ roles: [...ADM, "cpt", "acp"] }),
    },
    {
      id: "compta_books",
      link: "./bigbooks",
      title: "Grand livre",
      auth: authService.getAuth({ roles: [...ADM, "cpt", "acp"] }),
    },
    {
      id: "compta_entrycats ",
      link: "/dash/comptas/entrycats",
      title: "Classeurs",
      auth: authService.getAuth({ roles: [...ADM, "cpt", "acp"] }),
      ms: true,
    },
    {
      id: "compta_entryaccounts ",
      link: "./entryaccounts",
      title: "Comptes",
      auth: authService.getAuth({ roles: [...ADM, "cpt", "acp"] }),
    },
    { id: "compta_ohadas ", link: "./ohada", title: "Ohada", auth: authService.getAuth({ roles: [...ADM, "cpt", "acp"] }) },
    { id: "compta_bazar ", link: "./bazar", title: "Bazar", auth: authService.getAuth({ roles: [...ADM, "cpt", "acp"] }) },
  ];
  return <DisplayTab paths={paths} />;
};

export default ComptaIndex;

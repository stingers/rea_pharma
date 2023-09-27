import { IPath } from "asv-hlps/lib/cjs/models/types/Type";

import authService from "../../auth/services/authService";
import DisplayTab from "../../shared/displays/DisplayTab";

const DocuIndex = () => {
  const paths: IPath[] = [
    {
      id: "docus_faqs",
      title: "faqs",
      icon: "uil-home-alt",
      link: "/dash/docus/faqs",
    },
    {
      id: "docus_tools",
      title: <i className="fas fa-cogs"></i>,
      icon: "uil-home-alt",
      link: "/dash/docus/tools",
      ms: true,
      // auth: authService.getAuth({ roles: ["adm"] }),
    },
  ];
  return <DisplayTab paths={paths} />;
};

export default DocuIndex;

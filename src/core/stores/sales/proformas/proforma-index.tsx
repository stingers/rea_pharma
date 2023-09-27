import { IPath } from "asv-hlps/lib/cjs/models/types/Type";

import DisplayTab from "../../../../shared/displays/DisplayTab";

const paths: IPath[] = [
  /* {
    id: "proformas_memos",
    title: <i className="fas fa-memory"></i>,
    icon: "uil-home-alt",
    link: "/dash/proformas/memos",
  }, */
  {
    id: "proformas",
    title: "liste",
    icon: "uil-home-alt",
    link: "/dash/proformas/list",
  },
  {
    id: "proformas_products",
    title: "produits sur proformas",
    icon: "uil-home-alt",
    link: "/dash/proformas/listproducts",
  },
];
const ProformaIndex = () => {
  return <DisplayTab paths={paths} pgTitle={"proformas"} />;
};

export default ProformaIndex;

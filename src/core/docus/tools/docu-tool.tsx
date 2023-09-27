import { IPath } from "asv-hlps";

import DisplayTab from "../../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: 1,
    title: "Faq catégories",
    icon: "uil-home-alt",
    link: "/dash/tools/docus/faqcats",
  },
];

const DocuTool = () => {
  return <DisplayTab paths={paths} child />;
};

export default DocuTool;

import { IPath } from "asv-hlps";

import DisplayTab from "../../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: "utilities_tools_insurances",
    title: "Compagnies d'assurance",
    ms: true,
    link: "/dash/tools/utilities/tools/insurances",
  },
];
const UtilityToolIndex = () => {
  return <DisplayTab paths={paths} child />;
};

export default UtilityToolIndex;

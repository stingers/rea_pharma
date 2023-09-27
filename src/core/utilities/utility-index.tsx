import { IPath } from "asv-hlps";

import DisplayTab from "../../shared/displays/DisplayTab";

const paths: IPath[] = [
  {
    id: "utilities_vehicles",
    title: "Véhicules",
    link: "/dash/tools/utilities",
  },
  {
    id: "utilities_tools",
    title: <i className="fas fa-cogs"></i>,
    ms: true,
    link: "/dash/tools/utilities/tools",
  },
];

const UtilityIndex = () => {
  return <DisplayTab paths={paths} />;
};

export default UtilityIndex;

import { IPath } from "asv-hlps/lib/cjs/models/types/Type";

import DisplayTab from "../../../shared/displays/DisplayTab";

const EntryIndex = () => {
  const paths: IPath[] = [
    {
      id: "entries_list",
      title: "normal",
      icon: "uil-home-alt",
      link: "./list",
    },
    {
      id: "entries_list-detailed",
      title: "détaillé",
      icon: "uil-home-alt",
      link: "./listdetailed",
    },
  ];

  return <DisplayTab paths={paths} child />;
};

export default EntryIndex;

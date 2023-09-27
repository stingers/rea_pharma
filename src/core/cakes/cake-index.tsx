import { IPath } from "asv-hlps/lib/cjs/models/types/Type";

import authService from "../../auth/services/authService";
import DisplayTab from "../../shared/displays/DisplayTab";

const CakeIndex = () => {
  const paths: IPath[] = [
    {
      id: "cake_memo",
      title: "memo",
      link: "/dash/cakes",
    },
    {
      id: "cake_wishes",
      title: "suggestions",
      link: "/dash/cakes/wishes",
    },
    {
      id: "cake_tasks",
      title: "tasks",
      link: "/dash/cakes/tasks",
      auth: authService.getAuth({ roles: ["sadm"] }),
    },
  ];
  return <DisplayTab paths={paths} />;
};

export default CakeIndex;

import { IPath } from "asv-hlps/lib/cjs/models/types/Type";

import DisplayTab from "../../../shared/displays/DisplayTab";

const BuyIndex = () => {
  const paths: IPath[] = [
    {
      id: "buys_memos",
      title: <i className="fas fa-memory"></i>,
      icon: "uil-home-alt",
      link: "/dash/stores/buys/memos",
    },
    {
      id: "buy_draft",
      title: "draft",
      icon: "uil-home-alt",
      link: "/dash/stores/buys/draft",
    },
    {
      id: "buy_list",
      title: "liste",
      icon: "uil-home-alt",
      link: "/dash/stores/buys/list",
    },
  ];
  return <DisplayTab paths={paths} child />;
};

export default BuyIndex;

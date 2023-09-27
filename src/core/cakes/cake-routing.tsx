import { Route, Routes } from "react-router-dom";

import ListWish from "../utilities/wishes/list-wish";
import CakeIndex from "./cake-index";
import MemoCake from "./memo-cake";
import ListTask from "../utilities/tasks/list-task";

const CakeRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<CakeIndex />}>
        <Route index element={<MemoCake />} />
        <Route path="wishes" element={<ListWish />} />
        <Route path="tasks" element={<ListTask />} />
        {/* <Route path="wishes" element={<ListWish />}>
          <Route path=":status" element={<ListWish />} />
        </Route> */}
      </Route>
    </Routes>
  );
};

export default CakeRouting;

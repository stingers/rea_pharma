import { Route, Routes } from "react-router-dom";

import ListBalance from "./balances/list-balance";
import ListBazar from "./bazar/list-compta-bazar";
import ListComptaBazar from "./bazar/list-compta-bazar";
import ListBigBook from "./books/list-big-book";
import ComptaIndex from "./compta-index";
import EntryIndex from "./entries/entry-index";
import ListDetailedEntry from "./entries/list-detailed-entry";
import ListEntry from "./entries/list-entry";
import ListEntryAccount from "./entries/list-entry-account";
import ListEntryCat from "./entries/list-entry-cat";
import ListOhadaCat from "./ohada/list-ohada-cat";
import ListOhadaGrp from "./ohada/list-ohada-grp";
import ListOhadaPlan from "./ohada/list-ohada-plan";
import ListOhadaSubCat from "./ohada/list-ohada-sub-cat";
import OhadaIndex from "./ohada/ohada-index";

const ComptaRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<ComptaIndex />}>
        <Route path="entries" element={<EntryIndex />}>
          <Route index element={<ListEntry />} />
          <Route path="list" element={<ListEntry />} />
          <Route path="listdetailed" element={<ListDetailedEntry />} />
        </Route>
        <Route path="entrycats" element={<ListEntryCat url={"entrycats"} />} />
        <Route path="balances" element={<ListBalance url={"balances"} />} />
        <Route path="bigbooks" element={<ListBigBook />} />
        <Route path="bazar" element={<ListComptaBazar />} />
        <Route path="entryaccounts" element={<ListEntryAccount url={"entryaccounts"} />} />
        <Route path="ohada" element={<OhadaIndex />}>
          <Route index element={<ListOhadaSubCat url={"ohadasubcats"} />} />
          <Route path="subcats" element={<ListOhadaSubCat url={"ohadasubcats"} />} />
          <Route path="cats" element={<ListOhadaCat url={"ohadacats"} />} />
          <Route path="grps" element={<ListOhadaGrp url={"ohadagrps"} />} />
          <Route path="classes" element={<ListOhadaPlan url={"ohadaplans"} />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default ComptaRouting;

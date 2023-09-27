import { Route, Routes } from "react-router-dom";

import BuyIndex from "./buy-index";
import BuyMemo from "./buy-memo";
import DraftBuy from "./draft-buy";
import ListBuy from "./list-buy";

const BuyRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<BuyIndex />}>
        <Route index element={<BuyMemo />} />
        <Route path="memos" element={<BuyMemo />} />
        <Route path="list" element={<ListBuy />} />
        <Route path="draft" element={<DraftBuy />} />
      </Route>
    </Routes>
  );
};

export default BuyRouting;

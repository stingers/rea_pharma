import { Route, Routes } from "react-router-dom";
import DeliveryIndex from "./delivery-index";
import ListDelivery from "./list-delivery";
import ListDeliveryDone from "./list-delivery-done";
import ListDeliveryDriver from "./list-delivery-driver";
import MemoDelivery from "./memo-delivery";
import MngDelivery from "./mng-delivery";
import DeliveryBazar from "./delivery-bazar";

const DeliveryRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<DeliveryIndex />}>
        <Route index element={<ListDelivery />} />
        <Route path="memos" element={<MemoDelivery />} />
        <Route path="list" element={<ListDelivery />} />
        <Route path="done" element={<ListDeliveryDone />} />
        <Route path="mngs" element={<MngDelivery />} />
        <Route path="drivers" element={<ListDeliveryDriver />} />
        <Route path="bazars" element={<DeliveryBazar />} />
      </Route>
    </Routes>
  );
};

export default DeliveryRouting;

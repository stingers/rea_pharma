import { Toastify } from "asv-hlps-react";
import { useState } from "react";

import { PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import httpService from "../../services/httpService";
import DisplaySticks, { StickProps } from "../../shared/displays/display-sticks";

const DeliveryBazar = () => {
  const [loading, setLoading] = useState(false);
  const onUpdateSaleDeliveriesWithIsDeliveredError = async () => {
    try {
      setLoading(true);
      await httpService.get("zut/updateSaleDeliveriesWithIsDeliveredError");
      setLoading(false);
      Toastify.success();
    } catch (error) {
      Toastify.error();
    }
  };
  const bazars: StickProps[] = [
    {
      id: 1,
      label: "update deliveries incomplete with sale.isDelivered ",
      pulse: false,
      action: true,
      auth: authService.getAuth({ roles: PHD }),
    },
  ];

  const onStickAction = (id) => {
    switch (id) {
      case 1:
        onUpdateSaleDeliveriesWithIsDeliveredError();
        break;
    }
  };
  return <DisplaySticks sticks={bazars} loading={loading} onStickAction={onStickAction} />;
};

export default DeliveryBazar;

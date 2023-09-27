import { Toastify } from "asv-hlps-react/lib/cjs/reacts/helpers/Toastify";
import { useState } from "react";
import { PHD } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import DisplaySticks, { StickProps } from "../../../shared/displays/display-sticks";

const ProductBazar = () => {
  const [loading, setLoading] = useState(false);
  const onUpdateAvailability = async () => {
    try {
      setLoading(true);

      const { data } = await httpService.get("zut/updateAvailability");
      Toastify.success();
      setLoading(false);
    } catch (error) {
      Toastify.error();
      setLoading(false);
    }
  };
  const handleAction = (id) => {
    switch (id) {
      case 1:
        onUpdateAvailability();
        break;
    }
  };
  const bazars: StickProps[] = [
    {
      id: 1,
      label: "Update product availability",
      pulse: false,
      action: true,
      auth: authService.getAuth({ roles: PHD }),
    },
  ];
  return <DisplaySticks sticks={bazars} loading={loading} onStickAction={handleAction} />;
};

export default ProductBazar;

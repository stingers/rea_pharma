import { IPath } from "asv-hlps/lib/cjs/models/types/Type";

import { PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import DisplayTab from "../../shared/displays/DisplayTab";

const DeliveryIndex = () => {
  //  const location = useLocation();
  const paths: IPath[] = [
    {
      id: "deliveries_memos",
      title: <i className="fas fa-memory"></i>,
      icon: "uil-home-alt",
      link: "/dash/deliveries/memos",
      auth: authService.getAuth({ roles: [...PHD] }),
    },
    {
      id: "deliveries_mngs",
      title: "gestion des livraisons",
      icon: "uil-home-alt",
      link: "/dash/deliveries/mngs",
      auth: authService.getAuth({ roles: [...PHD] }),
    },
    {
      id: "deliveries_list",
      title: "liste des livraisons",
      icon: "uil-home-alt",
      link: "/dash/deliveries/list",
      auth: authService.getAuth({ roles: [...PHD] }),
    },
    {
      id: "deliveries_done",
      title: "livraisons terminées",
      icon: "uil-home-alt",
      link: "/dash/deliveries/done",
      auth: authService.getAuth({ roles: [...PHD] }),
    },
    {
      id: "deliveries_drivers",
      title: "livraisons des commandes",
      icon: "uil-home-alt",
      link: "/dash/deliveries/drivers",
      auth: authService.getAuth({ roles: [...PHD, "cha"] }),
    },

    {
      id: "deliveries_bazars",
      title: "bazar",
      // icon: "uil-home-alt",
      link: "/dash/deliveries/bazars",
      auth: authService.getAuth({ roles: PHD }),
      ms: true,
    },
  ];
  return <DisplayTab paths={paths} />;
};

export default DeliveryIndex;

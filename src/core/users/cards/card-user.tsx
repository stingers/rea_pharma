import { IPath } from "asv-hlps";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import { useParams } from "react-router-dom";

import httpService from "../../../services/httpService";
import DisplayTab from "../../../shared/displays/DisplayTab";

const CardUser = () => {
  const { id } = useParams();
  const { tob: user } = useReadonlyFetchTobs(httpService, "users", { param: +id, one: true });

  const displayUser = {
    id: 1,
    title: (
      <span className="text-black">
        <i className="fas fa-user me-1"></i>
        {user?.username + " " + user?.ste?.name + "( " + user?.fullname + " )"}
      </span>
    ),
    icon: "mdi mdi-home-variant",
    link: "abn",
    disabled: true,
    // text: "Home - Food truck quinoa dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.",
  };
  const paths: IPath[] = [
    {
      id: "user_stat",
      title: "stat",
      icon: "mdi mdi-account",
      link: `/dash/carduser/${id}/userstat`,
      state: `${id}`,
    },
    {
      id: "user_bill",
      title: "Facturation",
      icon: "mdi mdi-email-variant",
      link: `/dash/carduser/${id}/userbill`,
      state: `${id}`,
    },
    {
      id: "user_payment",
      title: "Payments",
      icon: "mdi mdi-email-variant",
      link: `/dash/carduser/${id}/userbill`,
      state: `${id}`,
    },
    {
      id: "user_sales",
      title: "Commandes",
      icon: "mdi mdi-email-variant",
      link: `/dash/carduser/${id}/usersale`,
      state: `${id}`,
    },
    {
      id: "user_sales",
      title: "Retours",
      icon: "mdi mdi-email-variant",
      link: `/dash/carduser/${id}/userback`,
      state: `${id}`,
    },
    {
      id: "user_bigbooks",
      title: "Grand livre",
      icon: "mdi mdi-email-variant",
      link: `/dash/carduser/${id}/userback`,
      state: `${id}`,
    },
    {
      id: "user_id",
      title: "identification",
      icon: "mdi mdi-email-variant",
      link: `/dash/carduser/${id}/userback`,
      state: `${id}`,
    },
    {
      id: "user_credit",
      title: "Credit",
      icon: "mdi mdi-email-variant",
      link: `/dash/carduser/${id}/userback`,
      state: `${id}`,
    },
    {
      id: "user_escompte",
      title: "Escompte",
      icon: "mdi mdi-email-variant",
      link: `/dash/carduser/${id}/userback`,
      state: `${id}`,
    },
  ];
  return <DisplayTab paths={[...paths, displayUser]} />;
};

export default CardUser;

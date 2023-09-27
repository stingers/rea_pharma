import { IPath } from "asv-hlps";
import { useMemo } from "react";

import DisplayTab from "../../../shared/displays/DisplayTab";

const ProfileIndex = ({ user }) => {
  const paths: IPath[] = useMemo(
    () => [
      {
        id: "users_profile_stats",
        title: "commandes",
        icon: "uil-home-alt",
        // link: "./userstatsales",
        link: "./profilestat",
        // link: "./userprofilestatsales",
        state: { user },
      },
      {
        id: "users_profile_bills",
        title: "factures",
        icon: "uil-home-alt",
        link: "./profilebills",
        state: { user },
      },
      {
        id: "users_profile_payments",
        title: "payments",
        icon: "uil-home-alt",
        link: "./profilepayments",
        state: { user },
      },
      {
        id: "users_profile_leaves",
        title: "congés",
        icon: "uil-home-alt",
        link: "./profileleaves",
        state: { user },
      },
    ],
    [user]
  );

  return <DisplayTab paths={paths} hasPgTitle={false} />;
};

export default ProfileIndex;

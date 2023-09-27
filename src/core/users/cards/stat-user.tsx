import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import { useEffect, useState } from "react";

import httpService from "../../../services/httpService";
import StatProductBy from "../../stats/stat-product-by";

type TobProps = {
  userId?: number;
};

const StatUser = ({ userId }: TobProps) => {
  const [lastBuy, setLastBuy] = useState(null);

  let { tob: user } = useReadonlyFetchTobs(httpService, "users", { param: +userId, one: true });

  useEffect(() => {
    const fetchTobs = async () => {
      // const { data: tob } = await httpService.getByParam(state, "users" );
      const { data: lastBuy } = await httpService.findById(userId, "sales/client/lastSale");
      setLastBuy(lastBuy);

      // console.log(lastBuy);
    };
    fetchTobs();
    return () => {};
  }, [userId]);

  return (
    <>
      {user?.ste?.grp?.code.toLocaleLowerCase() === "ag" && <StatProductBy userId={userId} />}
      <div>{user?.fullname}</div>
    </>
  );
  // return <div>{tob?.fullname}</div>;
};

export default StatUser;

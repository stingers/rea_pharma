import { useQuery } from "@tanstack/react-query";
import { User } from "asv-hlps/lib/cjs/models/entities/users/User";

import httpService from "../../../services/httpService";

const useUser = (code) => {
  const fetchDatas = () => httpService.getByParam(code, "users/grp").then((res) => res.data);
  return useQuery<User[], Error>({
    queryKey: ["users", code],
    queryFn: fetchDatas,
  });
};

export default useUser;

import { useQuery } from "@tanstack/react-query";

import httpService from "../../services/httpService";

interface QueryOptionType {
  staleTime?: number;
}

const useQueryCrudTest = (keys: string[], url: string, opts?: QueryOptionType) => {
  const fetchDatas = () => httpService.get(url).then((res) => res.data);

  return useQuery<any, Error>({
    queryKey: keys,
    queryFn: fetchDatas,
    staleTime: opts?.staleTime || 0,
  });
};

export default useQueryCrudTest;

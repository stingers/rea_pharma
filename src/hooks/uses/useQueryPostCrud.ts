import { useQuery, UseQueryOptions } from "@tanstack/react-query";

// import httpService from "../../services/httpService";
type CrudProps = {
  httpService: any;
  keys: any[];
  queryConfigs?: UseQueryOptions;
  params?: any;
  url: string;
};

// const useQueryPostCrud = (keys: string[], url: string, prms?: QueryParams, opts?: QueryOptionType) => {
const useQueryPostCrud = (crud: CrudProps) => {
  const fetchDatas = () => crud.httpService.postBody(crud?.params, crud.url).then((res) => res.data);

  return useQuery<any, any>({
    queryKey: crud.keys,
    queryFn: fetchDatas,
    ...crud.queryConfigs,
    // staleTime: opts?.staleTime || 0,
  });
};

export default useQueryPostCrud;

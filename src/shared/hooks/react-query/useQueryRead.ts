import { QueryFunction, UseQueryOptions, useQuery } from '@tanstack/react-query';

const useQueryRead = (keys: any[], fetchData: QueryFunction, queryConfigs?:UseQueryOptions) => {
  return useQuery<any, any>({
    queryKey: keys,
    queryFn: fetchData,
    ...queryConfigs
   /*  staleTime: queryConfigs?.staleTime,
    cacheTime: queryConfigs?.cacheTime */
  });
}

export default useQueryRead
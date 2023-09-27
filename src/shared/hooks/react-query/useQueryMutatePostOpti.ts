import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HlpCrud, Toastify } from "asv-hlps-react";

const useQueryMutatePostOpti = <T = any>(httpService: any, queryKeys: any[], url: string, param: any) => {
  const queryClient = useQueryClient();
  const hlpCrud = new HlpCrud(httpService);

  return useMutation<T, Error, any, any>({
    mutationFn: () => httpService.postParam(param, url).then((res) => res.data),
    onMutate: (tob) => {
      const oldTobs: T[] = queryClient.getQueryData(queryKeys);
      const nTobs = hlpCrud.updateTobOnList(tob, oldTobs);
      queryClient.setQueryData<any[]>(queryKeys, nTobs);
      return { oldTobs };
    },
    onSuccess: () => {
      Toastify.success();
    },
    onError: (error, nTob, context) => {
      if (!context) {
        return;
      }
      queryClient.setQueryData<any[]>(queryKeys, context.oldTobs);
      Toastify.error();
    },
  });
};

export default useQueryMutatePostOpti;

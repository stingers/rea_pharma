import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toastify } from "asv-hlps-react";
import httpService from "../../../services/httpService";
import hlpCrud from "../../helpers/hlpCrud";

const useQueryUpdateOpti = <T>(queryKeys: any[], url: string, propId: string = "id") => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, any, any>({
    mutationFn: (tob) => httpService.del(tob.id, url).then((res) => res.data),
    onMutate: (tob) => {
      const oldTobs: T[] = queryClient.getQueryData(queryKeys);
      const nTobs = hlpCrud.updateTobOnList(tob, oldTobs);
      queryClient.setQueryData<any[]>(queryKeys, nTobs);
      return { oldTobs };
    },
    onSuccess: (nTob, tob) => {
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

export default useQueryUpdateOpti;

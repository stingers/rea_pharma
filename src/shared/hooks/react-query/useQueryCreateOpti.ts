import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRole } from "asv-hlps";
import { Toastify } from "asv-hlps-react";
import httpService from "../../../services/httpService";

const useQueryCreateOpti = (queryKeys: any[], url: string) => {
  const queryClient = useQueryClient();

  return useMutation<UserRole, Error, any, any>({
    mutationFn: (nTob) => httpService.create(nTob, url).then((res) => res.data),
    onMutate: (nTob) => {
      // ------ get previous data ------
      const oldTobs = queryClient.getQueryData<any[]>(queryKeys) || [];
      // ------ updating Data in the chache------
      queryClient.setQueryData<any[]>(queryKeys, (tobs) => [nTob, ...(tobs || [])]);
      return { oldTobs };
    },
    onSuccess: (savedTob, nTob) => {
      queryClient.setQueryData<any[]>(queryKeys, (tobs) => tobs.map((tob) => (tob === nTob ? savedTob : tob)));
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

export default useQueryCreateOpti;

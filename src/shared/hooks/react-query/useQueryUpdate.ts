import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toastify } from "asv-hlps-react";

import httpService from "../../../services/httpService";
import hlpCrud from "../../helpers/hlpCrud";

type OptionsType = {
  propId?: string;
  invalidate?: boolean;
};

const useQueryUpdate = <T = any>(queryKeys: any[], url: string, opts?: OptionsType) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, T>({
    mutationFn: (tob: any) => httpService.putBody(!opts?.propId ? tob.id : tob[opts.propId], tob, url).then((res) => res.data),
    onSuccess: (savedTob, sendedTob) => {
      !opts?.invalidate
        ? queryClient.setQueryData<T[]>(queryKeys, (tobs) => hlpCrud.updateTobOnList(savedTob, tobs))
        : queryClient.invalidateQueries<T>(queryKeys);
      Toastify.success();
    },
    onError: () => {
      Toastify.error();
    },
  });
};

export default useQueryUpdate;

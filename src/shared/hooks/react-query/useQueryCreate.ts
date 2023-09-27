import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toastify } from "asv-hlps-react";

import httpService from "../../../services/httpService";
import hlpCrud from "../../helpers/hlpCrud";

type OptionsType = {
  propId?: string;
  invalidate?: boolean;
};

const useQueryCreate = <T = any>(queryKeys: any[], url: string, opts?: OptionsType) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error>({
    mutationFn: (tob) => httpService.create(tob, url).then((res) => res.data),
    onSuccess: (savedTob, sendedTob) => {
      opts?.invalidate
        ? queryClient.invalidateQueries<T[]>(queryKeys)
        : queryClient.setQueryData<any[]>(queryKeys, (tobs) =>
            !sendedTob[!opts?.propId ? "id" : opts.propId] ? [savedTob, ...(tobs || [])] : hlpCrud.updateTobOnList(savedTob, tobs)
          );
      Toastify.success();
    },
    onError: () => {
      Toastify.error();
    },
  });
};

export default useQueryCreate;

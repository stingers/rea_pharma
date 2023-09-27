import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toastify } from "asv-hlps-react";

import httpService from "../../../services/httpService";
import hlpCrud from "../../helpers/hlpCrud";

type ToggleProps = {
  tob: any;
  propertyName: string;
};

const useQueryToggle = <T>(queryKeys: any[], url: string) => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any, any>({
    mutationFn: ({ tob, propertyName }: ToggleProps) => httpService.post(url + "/" + propertyName, { id: tob?.id }).then((res) => res.data),
    onMutate: ({ tob, propertyName }: ToggleProps) => {
      const oldTobs: T[] = queryClient.getQueryData(queryKeys);
      // --------------------
      const nTobs = hlpCrud.togglePropOnList(tob, oldTobs, propertyName);
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

export default useQueryToggle;

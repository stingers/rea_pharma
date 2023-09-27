import { useQueryClient } from "@tanstack/react-query";
import { Toastify } from "asv-hlps-react";

import httpService from "../../../services/httpService";
import hlpCrud from "../../helpers/hlpCrud";

class HlpQuery {
  queryClient = useQueryClient();

  useQueryUpdateOnList = async (keys: any[], nTob, url: string) => {
    const oldTobs: any[] = this.queryClient.getQueryData([keys]);
    this.queryClient.setQueriesData([keys], (tobs: any[]) => hlpCrud.updateTobOnList(nTob, tobs));
    try {
      await httpService.postId(nTob.id, url);
      Toastify.success();
    } catch (error) {
      this.queryClient.setQueryData<any[]>([keys], (tobs: any[]) => (tobs = oldTobs));
      Toastify.error();
    }
  };
}

export default new HlpQuery() as HlpQuery;

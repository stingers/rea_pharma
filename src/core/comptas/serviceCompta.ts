import httpService from "../../services/httpService";

class ServiceCompta {
  getEntrylines = async (type: "balance" | "bigBook", accounts: any[], dates: any) => {
    const cpts = accounts.map((x) => {
      return +x.id;
    });
    switch (type) {
      case "balance":
        const { data: balances } = await httpService.postBody({ accounts: cpts, dates }, "entrylines/balances");
        return balances;
      case "bigBook":
        const { data: bigBooks } = await httpService.postBody({ accounts: cpts, dates }, "entrylines/balances");
        return bigBooks;
    }

    // const { data } = await httpService.postBody({ accounts: cpts, dates }, "entrylines/balances");
    // return data;
  };
}

export default new ServiceCompta() as ServiceCompta;

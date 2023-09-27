import httpService from "../../../services/httpService";

class BuyService {
  getReapproByMonthAndPvd = async (nbMonth: number, pvdId: number) => {
    return httpService.getByTwoParams(3, pvdId, "products/reappro");
  };
}

export default new BuyService() as BuyService;

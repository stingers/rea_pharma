import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";

import httpService from "../../../../services/httpService";

class SaleService {
  mngIsOnProcessed(saleId: number, isOnProcessed: boolean) {
    return httpService.postBody({ id: saleId, isOnProcessed }, "saletreatments/isOnProcessed");
  }

  checkTreatment(sale: Sale, treat: string) {
    return httpService.postBody({ saleId: sale.id, treat: treat }, "saletreatments");
  }

  updateSaleValided(sale: Sale) {
    return httpService.putBody(sale.id, sale, "salevalided");
  }
}

export default new SaleService() as SaleService;

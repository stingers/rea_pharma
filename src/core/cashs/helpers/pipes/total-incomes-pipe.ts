import { BillPayment } from "asv-hlps/lib/cjs/models/entities/bills/BillPayment";

import { HlpCash } from "../hlpCash";

class TotalIncomesPipe {
  trans(tobs: BillPayment[], arg?: "cheque" | "cash" | "virement" | "chequeVirement"): number {
    switch (arg) {
      case "cheque":
        return HlpCash.getTotalIncomesChecks(tobs);
      case "cash":
        return HlpCash.getTotalIncomesCashs(tobs);
      case "virement":
        return HlpCash.getTotalIncomesVirements(tobs);
      case "chequeVirement":
        return HlpCash.getTotalIncomes(tobs) - HlpCash.getTotalIncomesCashs(tobs);
      default:
        return HlpCash.getTotalIncomes(tobs);
    }
  }
}
export default new TotalIncomesPipe() as TotalIncomesPipe;

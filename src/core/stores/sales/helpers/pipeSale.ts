import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import { getTotalAmountAllIncludedOnSale, getTotalQtityFreeOnSale } from "asv-hlps/lib/cjs/sale";

class PipeSale {
  totalSale(sale: Sale, param: "amountAllIncluded" | "qtityFree"): number {
    switch (param) {
      case "amountAllIncluded":
        return !sale.isDelivering ? getTotalAmountAllIncludedOnSale(sale) || 0 : getTotalAmountAllIncludedOnSale(sale, true) || 0;
      case "qtityFree":
        return getTotalQtityFreeOnSale(sale);

      default:
        throw new Error("Manque de param");
    }
  }

  treat(sale: Sale, state: "waiting" | "processing" | "processed" | "delivering" | "delivered" | "picking") {
    switch (state) {
      case "waiting":
        return !sale.isProcessing;
      case "processing":
        return sale.isProcessing && !sale.isProcessed;
      case "processed":
        return sale.isProcessing && sale.isProcessed && !sale.isPicking;
      case "picking":
        return sale.isProcessing && sale.isProcessed && sale.isPicking && !sale.isDelivering;
      case "delivering":
        return sale.isProcessing && sale.isProcessed && sale.isPicking && sale.isDelivering && !sale.isDelivered;
      case "delivered":
        return sale.isProcessing && sale.isProcessed && sale.isPicking && sale.isDelivering && sale.isDelivered;
    }
  }
}

export default new PipeSale() as PipeSale;

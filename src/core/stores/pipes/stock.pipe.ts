//@ts-ignore
import { HlpProduct, Product } from "asv-hlps";

// import HlpProduct, {  Product } from "asv-hlps";

import config from "../../../config";

class StockPipe {
  /**
   * get stock product in store
   * @param tob
   * @param storeName
   * @returns
   */
  // transform(tob: Product,  param: string) : number{
  transform(tob: Product, param: "valueInDepots" | "store" | "salable" | "reserve" | "all"): number {
    // const storeName = (environment.host === 'cpa') ? 'eqeer' : 'cpa'
    const storeName = config.host;
    switch (param) {
      case "valueInDepots":
        return HlpProduct.stockValueInDepots(tob, [storeName]);
      case "store":
        return HlpProduct.getStockStore(tob);
      case "salable":
        return HlpProduct.getStockSalable(tob);
      case "reserve":
        return HlpProduct.qtityInAllDepotsExeptStore(tob?.ins, ["cpa"]) || 0;
      case "all":
        return HlpProduct.qtityInAllDepots(tob?.ins) || 0;
    }
  }
}

export default new StockPipe();

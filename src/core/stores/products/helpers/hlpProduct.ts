import { packAndUnit, Product, ProductIn } from "asv-hlps";
import dayjs from "dayjs";

import config from "../../../../config";

class HlpProduct {
  productCatCode(product: Product, catCodes: string[]) {
    return catCodes.includes(product.cat.code && product.cat.code.toLowerCase());
  }

  qtityInAllDepots(ins: ProductIn[]) {
    return this.getQtitiesInDepots(ins);
    /* if (!ins.length) {return 0; }

    ins =  ins.filter( x => x.depot && x.depot.name.toLocaleLowerCase() !== 'arrivage');
    return ins.reduce((prev, curr: ProductIn) => {
     return  +prev +  (+curr.qtity);
    }, 0); */
  }

  stockValueInDepots(product: Product, exceptDepots: string[] = []) {
    if (!product.ins.length) {
      return 0;
    }
    let ins = product.ins;
    ins = ins.filter((x) => x.depot && !["arrivage", ...exceptDepots].includes(x.depot.name.toLocaleLowerCase()));
    return ins.reduce((prev, curr: ProductIn) => {
      // return  +prev +  (+curr.qtity * (+product.stores?.pghtPrice || 0));
      return +prev + +curr.qtity * (+product.stores[0]?.pghtPrice || 0);
    }, 0);

    // return currencyFormatter(Math.floor(value: string | number));
  }

  getQtitiesInDepots(ins: ProductIn[], exceptDepots: string[] = []) {
    // if (!ins.length) {
    if (ins.length <= 0) {
      return 0;
    }
    ins = ins.filter((x) => x.depot && x.depot.hasViewStock && !["arrivage", ...exceptDepots].includes(x.depot.name.toLocaleLowerCase()));

    // ins =  ins.filter(x => x.depot && x.depot.hasViewStock);
    return ins.reduce((prev, curr: ProductIn) => {
      return +prev + +curr.qtity;
    }, 0);
  }

  qtityInAllDepotsExeptStore(ins: ProductIn[]) {
    return this.getQtitiesInDepots(ins, [config.host]);

    /* if (!ins?.length) {return 0; }

    ins =  ins.filter( x => x.depot && x.depot.name.toLocaleLowerCase() !== storeName &&  x.depot.name.toLocaleLowerCase() !== 'arrivage');
    return ins.reduce((prev, curr: ProductIn) => {
     return  prev +  (+curr.qtity);
    }, 0); */
  }

  getStockSalable(product: Product): number {
    const stockAllSalable = +this.qtityInAllDepots(product.ins) - (+product.stores[0].stockReserved || 0);
    const stockStore = +this.getStockStore(product);

    let stockSalable: number = 0;
    if (sessionStorage.getItem("isProforma") === "isProforma") {
      stockSalable = stockAllSalable;
    } else {
      if (stockAllSalable <= stockStore) {
        stockSalable = stockAllSalable;
      }
      if (stockAllSalable > stockStore) {
        stockSalable = stockStore;
      }
    }
    return stockSalable || 0;
  }

  pghtPrice(pvdPrice: number, pght: number) {
    return pvdPrice * pght;
  }

  costPrice(fees: number): number {
    return +this.pghtPrice * fees;
  }

  salePrice(profit: number): number {
    return +this.costPrice * profit;
  }

  puplicPrice(phcieProfit: number): number {
    return +this.salePrice * phcieProfit;
  }
  tauxOfMarge(): number {
    return ((+this.costPrice - +this.salePrice) / +this.costPrice) * 100;
  }

  getStockStore(product: Product) {
    let stock: number = 0;
    if (product?.ins) {
      for (const pdtIn of product?.ins) {
        // if(pdtIn.depot.name.toLocaleLowerCase() === environment.host.toLocaleLowerCase()) {
        if (pdtIn.depot.main === "master") {
          stock += pdtIn.qtity;
        }
      }
    }
    // return stock - (+product.stores[0].stockReserved|| 0)
    return stock;
    // if(!product.ins.length) {return 0}
    /* return product.ins.reduce((prev, curr: ProductIn) => {
      return prev +  +curr.qtity
    }, 0) */
  }

  getLotsToString(ins: ProductIn[]) {
    // let lots: {lot: string, expDate: string}[] = []
    let lots: string[] = [];
    for (const pdtIn of ins) {
      if (pdtIn.lot) {
        lots.push(pdtIn.lot + " =>" + dayjs(pdtIn.expirationDate).format("DD/MM/YYYY"));
      }
    }
    return [...new Set(lots)];
  }
  stock(tob: Product, param: "valueInDepots" | "store" | "salable" | "reserve" | "all"): number {
    // const storeName = (environment.host === 'cpa') ? 'eqeer' : 'cpa'
    // const storeName = environment.host;
    const storeName = "cpa";
    switch (param) {
      case "valueInDepots":
        return this.stockValueInDepots(tob, [storeName]);
      case "store":
        return this.getStockStore(tob);
      case "salable":
        return this.getStockSalable(tob);
      case "reserve":
        return this.qtityInAllDepotsExeptStore(tob?.ins) || 0;
      case "all":
        return this.qtityInAllDepots(tob?.ins) || 0;
    }
  }

  stockTotal = (tobs: Product[], param: "inDepots" | "store" | "all" | "depotsReserve" | "value"): number => {
    if (!tobs.length) {
      return 0;
    }
    // const storeName = (environment.host === 'cpa') ? 'eqeer': 'cpa'
    const storeName = tobs[0].stores[0].name;
    switch (param) {
      case "inDepots":
        return tobs.reduce((prev, curr: Product) => {
          return prev + this.getQtitiesInDepots(curr?.ins, [storeName]);
        }, 0);
      case "store":
        return tobs.reduce((prev, curr: Product) => {
          return prev + this.getStockStore(curr);
        }, 0);

      case "all":
        return tobs.reduce((prev, curr: Product) => {
          return prev + this.qtityInAllDepots(curr.ins);
        }, 0);

      case "depotsReserve":
        return tobs.reduce((prev, curr: Product) => {
          return prev + this.qtityInAllDepotsExeptStore(curr.ins);
        }, 0);

      case "value":
        return tobs.reduce((prev, curr: Product) => {
          return prev + this.stockValueInDepots(curr);
        }, 0);
    }
  };

  packAndUnit(qtity: number, qtityPerPackaging: number = 0) {
    return packAndUnit(qtity, qtityPerPackaging);
  }
}
export default new HlpProduct() as HlpProduct;

import { StatSaleProduct } from './StatSaleProduct';

export interface StatSale {
  nbSales: number;
  bill: any;
  saleProducts: StatSaleProduct[];


}

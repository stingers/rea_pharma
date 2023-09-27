import { SaleProduct, User } from "asv-hlps";
/**
 * SaleBack interface = Sale when isBack = true
 */
export interface SaleBack {
  // createdAt: Date;
  id: number;
  ref: string;
  createdAt: any;
  nbProducts: number;
  totalQtity?: number;
  isValided?: boolean;
  isRejected?: boolean;
  treatMan: User;
  encoder: User;
  backChoice: string;
  treatDate: Date;
  client: User;
  saleProducts: SaleProduct[];

  totalAmountBack: number;
  comment?: string;
  reason?: string;

  /* getNbProductsOnSale = () => {
    return this.saleBackProducts.length;
  } */
}

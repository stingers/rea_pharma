import { Product } from "asv-hlps";

export interface StatSaleProduct {
  pdtId: number;

  pdtRef: string;
  pdtDesignation: string;
  pdtStock?: string;

  sumQtityDlvr: number;
  sumQtityOdr: number;
  sumQtityFree: number;
  sumAmountQtityOdr: number;
  sumAmountQtityDlvr: number;
  product: Product;
}

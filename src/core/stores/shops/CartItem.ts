import { Product } from "asv-hlps";

export class CartItem {
  product: Product;
  qtityOdr: number;
  qtityFree?: number = 0;
  speUnitPrice?: number = 0;
  addDiscount?: boolean = false;
}

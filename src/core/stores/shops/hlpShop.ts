import { sesStorageGet } from "asv-hlps";
import { Toastify } from "asv-hlps-react";
import { Product } from "asv-hlps/lib/cjs/models/entities/products/Product";
import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import { SaleItems } from "asv-hlps/lib/cjs/models/entities/sales/SaleItems";
import { User } from "asv-hlps/lib/cjs/models/entities/users/User";
import { unitPriceByClientCat } from "asv-hlps/lib/cjs/product";
import { inSteGrp, isStaffSte } from "asv-hlps/lib/cjs/user";

import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import hlpProduct from "../products/helpers/hlpProduct";
import { CartItem } from "./CartItem";

class HlpShop {
  addToCart = async (cartItems: CartItem[], product: Product, qtity: number): Promise<CartItem[]> => {
    let nCartItems: CartItem[] = [];
    this.createCart();
    const nItem = cartItems.find((item) => item.product.id === product.id) || null;

    if (!nItem) {
      nCartItems = [...cartItems, { product, qtityOdr: 1 }];
    } else {
      nCartItems = await this.updateCartQtity(cartItems, product, qtity);
    }
    sessionStorage.setItem("basket", JSON.stringify(nCartItems));
    return nCartItems;
  };

  private createCart = async () => {
    if (!sessionStorage.getItem("sale")) {
      const newSale: Sale = null;

      try {
        const { data: sale } = await httpService.postBody({ newSale }, "shop/sale");
        if (sale) {
          sessionStorage.setItem("sale", JSON.stringify(sale));
        }
      } catch (error) {
        Toastify.error();
      }
    }
  };

  removeItem = (cartItems: CartItem[], product) => {
    cartItems.find((item: CartItem, index: number) => {
      if (item.product.id === product.id) {
        const item: CartItem = cartItems[index];
        this.removeFromCart(cartItems, item);
      }
      return false;
    });
  };

  // ------ Removed in cart ------
  removeFromCart = (cartItems: CartItem[], item: CartItem) => {
    const index = cartItems.indexOf(item);
    cartItems.splice(index, 1);
    sessionStorage.setItem("basket", JSON.stringify(cartItems));
  };

  // --------------------
  getTotalAmount = (cartItems: CartItem[], client: User) => {
    return cartItems.reduce((prev: number, curr: CartItem) => {
      return Math.ceil(
        prev +
          ((this.unitPriceByClientCat(curr.product, client, curr.speUnitPrice, curr.addDiscount) * curr.product.tva) / 100) *
            curr.qtityOdr +
          this.unitPriceByClientCat(curr.product, client, curr.speUnitPrice, curr.addDiscount) * curr.qtityOdr
      );
    }, 0);
  };

  // ------ getTotalAmountAllIncluded ------
  getTotalAmountAllIncluded = (
    cartItems: CartItem[],
    client: User,
    shippingFee: number = 0,
    otherFee: number = 0,
    discount: number = 0
  ) => {
    return Math.ceil(
      this.getTotalAmount(cartItems, client) + shippingFee + otherFee + -this.getTotalAmountDiscount(cartItems, client, discount)
    );
  };

  getTotalAmountDiscount = (cartItems, client, discountRate: number) => {
    return Math.ceil((+this.getTotalAmount(cartItems, client) * discountRate) / 100);
  };
  // ------ total quantity free------
  getTotalQtityFree = (cartItems: CartItem[]): number => {
    return cartItems.reduce((prev: number, curr: CartItem) => {
      return prev + (+curr.qtityFree || 0);
    }, 0);
  };
  // ------ total quantity  ------
  getTotalQtityReal = (cartItems: CartItem[]) => {
    return cartItems.reduce((prev: number, curr: CartItem) => {
      return prev + (curr.qtityOdr + (curr.qtityFree || 0));
    }, 0);
  };
  // ------ Total sub amount ------
  getTotalAmountWithoutTva = (cartItems: CartItem[], client: User) => {
    return cartItems.reduce((prev: number, curr: CartItem) => {
      return Math.ceil(prev + this.unitPriceByClientCat(curr.product, client, curr.speUnitPrice, curr.addDiscount) * curr.qtityOdr);
    }, 0);
  };
  // ------ Total tva ------
  getTotalTva = (cartItems: CartItem[], client: User) => {
    return cartItems.reduce((prev: number, curr: CartItem) => {
      return Math.ceil(
        prev +
          this.unitPriceByClientCat(curr.product, client, curr.speUnitPrice, curr.addDiscount) * (+curr.product.tva / 100) * curr.qtityOdr
      );
    }, 0);
  };
  // ------ Update Cart Value ------
  // updateCartQtity = (cartItems: CartItem[], product: Product, qtity: number): CartItem | boolean => {
  updateCartQtity = async (cartItems: CartItem[], product: Product, qtity: number) => {
    const index = cartItems.findIndex((item) => item.product.id === product.id);
    // const qtyInCart = +cartItems[index].qtityOdr + qtity;
    cartItems[index].qtityOdr = qtity;
    const qtyInCart = +cartItems[index].qtityOdr;
    const stock = this.calculateStockOrQtityLimitCounts(cartItems[index], +qtity);

    // ------ if product has promo ------
    if (product?.stores[0]?.promos.length) {
      let totalUg = 0;
      let qtityBuy = qtyInCart;
      let obj: any;
      const promos = product.stores[0].promos;
      // --------------------
      try {
        const { data } = await httpService.findById(product.id, "productpromos/product");
        if (data.length) {
          data.map((data) => {
            obj = this.calUg(qtityBuy, data.qtityPromo, data.qtityFree);
            totalUg += obj.nbUg;
            qtityBuy = obj.restQtityBuy;
          });
        }
        cartItems[index].qtityFree = +totalUg;
        sessionStorage.setItem("basket", JSON.stringify(cartItems));
      } catch (error) {}
    }
    if (qtyInCart > 0 && stock) {
      cartItems[index].qtityOdr = qtyInCart;
    }
    sessionStorage.setItem("basket", JSON.stringify(cartItems));
    return cartItems;
  };

  unitPriceByClientCat(product: Product, client: User, speUnitPrice = 0, addDiscount: boolean = false): number {
    return unitPriceByClientCat(product, client, speUnitPrice, addDiscount);
  }

  addDiscount(cartItems: CartItem[], item: CartItem) {
    item.addDiscount = !item.addDiscount;
    sessionStorage.setItem("basket", JSON.stringify(cartItems));
  }

  ppPhcie(client: User) {
    if (!client) {
      return false;
    }
    return inSteGrp(["ph"], client);
  }

  convertToSale(cartItems: CartItem[], sale: Sale) {
    const items = sale.saleProducts;
    const client = sale.client;
    for (const item of items) {
      this.updateCartQtity(cartItems, item.product, item.qtityOdr);
    }
    sessionStorage.setItem("client", JSON.stringify(client));
    // sale = deepClone(sale);
    delete sale.saleProducts;
    delete sale.client;
    // --------------------
    if (sale.isProforma) {
      sale.proformaToSale = true;
      sale.isValided = true;
      sale.isProforma = false;
    } else if (sale.isWaiting) {
      sale.waitingToSale = true;
      sale.isWaiting = false;
      sale.isValided = true;
    }
    // --------------------
    sessionStorage.setItem("sale", JSON.stringify(sale));
    // --------------------
  }

  removeAllFromCart(cartItems: CartItem[]) {
    cartItems.splice(0, cartItems.length);
    sessionStorage.removeItem("basket");
    if (isStaffSte(["cpa"], authService.authUser().ste.name)) {
      sessionStorage.removeItem("client");
    }
    sessionStorage.removeItem("sale");
    sessionStorage.removeItem("proforma");
  }

  async checkout(cartItems: CartItem[]) {
    const saleItems = this.getSaleItems();
    try {
      const { data } = await httpService.create(saleItems, "checkout");
      if (data) {
        this.removeAllFromCart(cartItems);
        Toastify.success("commande bien enégistrée");
      }
    } catch (error) {}
  }

  getSaleItems() {
    const isProforma: string = sesStorageGet("isProforma");
    let saleItems = new SaleItems();
    saleItems.sale = JSON.parse(sessionStorage.getItem("sale"));
    if (isProforma) {
      saleItems.sale.isProforma = true;
    }
    saleItems.items = JSON.parse(sessionStorage.getItem("basket"));
    saleItems.clientId = JSON.parse(sessionStorage.getItem("client")).id;
    return saleItems;
    /* const saleItems.sale: Sale = JSON.parse(sessionStorage.getItem('sale'));
    const items: SaleProduct[] = JSON.parse(sessionStorage.getItem('basket'));
    const client = JSON.parse(sessionStorage.getItem('client'));
    return { sale: sale, items: items, clientId: client.id }; */
  }

  private calUg(qtityBuy: number, qtityPromo: number, ug: number) {
    let quot: number;
    let nbUg: number;
    let restQtityBuy: number = qtityBuy;
    if (qtityBuy < qtityPromo || qtityPromo <= 0) {
      quot = 0;
      nbUg = 0;
      return { quot, restQtityBuy, nbUg };
    }
    quot = Math.floor(restQtityBuy / qtityPromo);
    nbUg = quot * ug;
    // restQtityBuy = restQtityBuy - (quot * qtityPromo);
    restQtityBuy -= quot * qtityPromo;
    return { quot, restQtityBuy, nbUg };
  }

  // ------ Calculate Product stock Counts ------
  public calculateStockOrQtityLimitCounts(item: CartItem, qtity: number): CartItem | boolean {
    // const qty = +item.qtityOdr + qtity;
    const qty = +item.qtityOdr;
    const qtyLimitByClient = +item.product.stores[0].qtityLimit;

    const stockSalable = +hlpProduct.getStockSalable(item.product);

    const stock = qtyLimitByClient > 0 && stockSalable >= qtyLimitByClient ? qtyLimitByClient : stockSalable;

    if (stock < qty) {
      // this.modalService.confirmError(" Stock ou quantité limitée  à " + stock, "Quantité limitée");s
      item.qtityOdr = stock;
      return false;
    }
    return true;
  }
}

export default new HlpShop() as HlpShop;

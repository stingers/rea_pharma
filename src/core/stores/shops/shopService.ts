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
import hlpShop from "./hlpShop";

class ShopService {
  shopCartItems = JSON.parse(sessionStorage.getItem("basket")) || [];
  client: User = JSON.parse(sessionStorage.getItem("client"));

  addToCart = (product: Product, qtity: number): CartItem | boolean => {
    this.createCart();

    let item: CartItem | boolean = false;
    // If Products exist
    const hasItem = this.updateCartQtity(product, qtity);

    // If Products does not exist (Add New Products)
    if (!hasItem) {
      item = { product: product, qtityOdr: 0 };
      this.shopCartItems.push(item);
      this.updateCartQtity(product, qtity);
    }
    sessionStorage.setItem("basket", JSON.stringify(this.shopCartItems));
    return item;
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

  addQtity = (product: any, qtity: string | number): CartItem | boolean => {
    let newQtity = 0;
    // this.qtityTerm.next(qtity as string);
    // this.qtityTerm.pipe(debounceTime(300), distinctUntilChanged()).subscribe((data) => (newQtity = +data));
    return this.updateCartQtity(product, newQtity);
  };

  removeItem = (product) => {
    this.shopCartItems.find((item: CartItem, index: number) => {
      if (item.product.id === product.id) {
        // const item = this.shopCartItems[index];
        const item: CartItem = this.shopCartItems[index];
        this.removeFromCart(item);
      }
      return false;
    });
  };

  // ------ Removed in cart ------
  removeFromCart = (item: CartItem) => {
    // if (item === undefined) {return false;  }
    const index = this.shopCartItems.indexOf(item);
    this.shopCartItems.splice(index, 1);
    sessionStorage.setItem("basket", JSON.stringify(this.shopCartItems));
  };

  public getProductQtity(product: Product): number {
    let qty = 0;
    // this.addToCart(product)
    this.shopCartItems.find((item: CartItem, index: number) => {
      if (item.product.id === product.id) {
        qty = this.shopCartItems[index].qtityOdr;
      }
    });
    return qty;
  }

  // ------ Update Cart Value ------
  updateCartQtity = (product: Product, qtity: number): CartItem | boolean => {
    return this.shopCartItems.find(async (item: CartItem, index: number) => {
      if (item.product.id === product.id) {
        const qtyInCart = +this.shopCartItems[index].qtityOdr + qtity;
        // --------------------

        if (product.stores[0].promos.length) {
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
            this.shopCartItems[index].qtityFree = +totalUg;
            sessionStorage.setItem("basket", JSON.stringify(this.shopCartItems));
          } catch (error) {}
        }
        // --------------------
        const stock = this.calculateStockOrQtityLimitCounts(this.shopCartItems[index], +qtity);
        if (qtyInCart > 0 && stock) {
          this.shopCartItems[index].qtityOdr = qtyInCart;
        }
        sessionStorage.setItem("basket", JSON.stringify(this.shopCartItems));
        return true;
      }
      return false;
    });
  };

  unitPriceByClientCat(product: Product, client: User, speUnitPrice = 0, addDiscount: boolean = false): number {
    return unitPriceByClientCat(product, client, speUnitPrice, addDiscount);
  }

  addDiscount(item: CartItem) {
    item.addDiscount = !item.addDiscount;
    sessionStorage.setItem("basket", JSON.stringify(this.shopCartItems));
  }

  ppPhcie(client: User) {
    if (client) {
      return;
    }
    return inSteGrp(["ph"], client);
  }
  removeAllFromCart() {
    this.shopCartItems.splice(0, this.shopCartItems.length);
    sessionStorage.removeItem("basket");
    if (isStaffSte(["cpa"], authService.authUser())) {
      sessionStorage.removeItem("client");
    }
    sessionStorage.removeItem("sale");
    sessionStorage.removeItem("proforma");

    /* this.shopCartItems.forEach(item => {
       this.shopCartItems.splice(this.shopCartItems.indexOf(item), 1); */
    //  sessionStorage.removeItem('basket');
    // });
  }

  async checkout(cartItems: CartItem[]) {
    // console.log(cartItems);
    const saleItems = this.getSaleItems();
    try {
      const { data } = await httpService.create(saleItems, "checkout");
      if (data) {
        hlpShop.removeAllFromCart(cartItems);
        // navigate(["/dash/shopcart"]);
        Toastify.success("commande bien enégistrée");
      }
    } catch (error) {}
  }

  getSaleItems() {
    let saleItems = new SaleItems();
    saleItems.sale = JSON.parse(sessionStorage.getItem("sale"));
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
    const qty = +item.qtityOdr + qtity;
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

export default new ShopService() as ShopService;

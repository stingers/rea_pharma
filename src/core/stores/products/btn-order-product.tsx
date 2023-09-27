import { Product } from "asv-hlps";
import { Toastify } from "asv-hlps-react";
import classNames from "classnames";
import { Button } from "react-bootstrap";

import { CartItem } from "../shops/CartItem";
import { useShopCartContext } from "../shops/shop-cart-context";
import shopService from "../shops/shopService";
import BtnUpdateQtityProduct from "./btn-update-qtity-product";
import hlpProduct from "./helpers/hlpProduct";

type TobType = {
  item?: CartItem;
  product: Product;
  // qtityOdr?: number;
};
const BtnOrderProduct = ({ product, item }: TobType) => {
  const { getItemQtity, cartItems, addToCart } = useShopCartContext();
  const qtity = getItemQtity(product);
  const index = cartItems.findIndex((x) => x.product.id === product.id);

  const getQtity = () => {
    // return shopService.getProductQtity(product);
    // return qtityOdr;
  };

  // ------ add to cart ------
  const onAddToCart = () => {
    const qtity = 1;
    shopService.addToCart(product, qtity);
    Toastify.success(` ${product.designation} est ajouté à la commande`);
  };

  const onRemoveItem = () => {
    shopService.removeItem(product);
    //
  };

  const onUpdateItem = () => {
    shopService.removeItem(product);
    //
  };

  // --------------------
  const btnNotAvailableStatus = () => {
    if (!product?.stores[0].isAvailable || hlpProduct.stock(product, "salable") <= 0) {
      return { btnLabel: "indisponible", variant: "btn-danger" };
    }
    if (product?.stores[0].isAvailable && product?.pghtPrice <= 0) {
      return { btnLabel: "prix indisponible", variant: "btn-warning" };
    }
    if (product?.stores[0].isAvailable && !product?.stores[0].isActive) {
      return { btnLabel: "inactif", variant: "btn-info" };
    }
    return { btnLabel: "inactif", variant: "btn-info" };
  };

  const getAvailableProduct = (product: Product) => {
    return (
      product.stores[0].isAvailable &&
      product.stores[0].isActive &&
      hlpProduct.stock(product, "salable") > 0 &&
      product.stores[0].pghtPrice > 0
    );
  };

  return (
    <div className="float-end">
      {getAvailableProduct(product) ? (
        <div>
          {/* {getQtity() === 0 ? ( */}
          {qtity === 0 ? (
            // {qtityOdr <= 0 ? (
            // <Button size="sm" className={classNames("btn-success btn-sm  text-uppercase ")} onClick={onAddToCart}>
            <Button className={classNames("btn-success btn-xs  text-uppercase ")} onClick={() => addToCart(product)}>
              commander
            </Button>
          ) : (
            <BtnUpdateQtityProduct product={product} item={cartItems[index]} />
          )}
        </div>
      ) : (
        <>
          {/* <Button size="sm" className="btn-sm btn-danger text-uppercase  not-allowed">
            {(!product?.stores[0].isAvailable || hlpProduct.stock(product, "salable") <= 0) && <>indisponible</>}
            {product?.isAvailable && product?.pghtPrice <= 0 && <>indisponible</>}
          </Button> */}
          <Button className={classNames(btnNotAvailableStatus()?.variant, "btn-xs  text-uppercase  not-allowed")}>
            {btnNotAvailableStatus()?.btnLabel}
          </Button>
        </>
      )}
    </div>
  );
};

export default BtnOrderProduct;

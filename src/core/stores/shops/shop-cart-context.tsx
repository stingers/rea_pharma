import { CartItem, currencyFormatter, hasRole, isStaffSte, Product, Sale, sesStorageGet, sesStorageSet, User } from "asv-hlps";
import { pathName } from "asv-hlps-react";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import { useStorage } from "../../../shared/hooks/useStorage";
import hlpShop from "./hlpShop";

type ShopCartProviderProps = {
  children: ReactNode;
};

// export interface ShopCartProps {
type ShopCartProps = {
  // type ShopCartContext = {
  // item: CartItem;
  // cartItems: CartItem[];
  sale: Sale;
  setSale?: Dispatch<SetStateAction<Sale>>;
  client: User;
  setClient: Dispatch<SetStateAction<User>>;
  cartItems: CartItem[];
  modalProducts?: boolean;
  setModalProducts?: Dispatch<SetStateAction<boolean>>;
  clients: User[];
  setClients: Dispatch<SetStateAction<User[]>>;
  // qtity;
  shippingFee: number;
  otherFee: number;
  discountRate: number;
  // incrementQtity: (product: Product) => void;
  incrementQtity: (item: CartItem) => void;
  // decrementQtity: (product: Product) => void;
  decrementQtity: (item: CartItem) => void;
  addToCart: (product: Product) => void;
  updateItemQtity: (product: Product, qtity: number) => void;
  getItemQtity: (product: Product) => number;
  removeItemFormCart: (product: Product) => void;
  getSubTotal: () => number | string;
  getTotalTva: () => number | string;
  getTotalAmountAllIncluded: () => number | string;
  getTotalAmount: () => number | string;
  getSaleRef?: () => string | null;
  onModalProducts?: () => void;
  removeAllFormCart?: () => void;
  getTatolOfproducts?: () => number;
  getTatolQtities?: () => number;
  getTotalAmountDiscount?: () => number | string;
  addSpeUnitPrice: (product: Product, speUnitPrice: number) => void;
  addDiscount: (cartItems: CartItem[], item: CartItem) => void;
  setCartItems: any;
};

// create context
const ShopCartContext = createContext<ShopCartProps>({} as ShopCartProps);

// wrapping context in useShopCartContext
export const useShopCartContext = () => {
  return useContext(ShopCartContext);
};

export const ShopCartProvider = ({ children }: ShopCartProviderProps) => {
  const getClient: User = sesStorageGet("client");
  const getSale: Sale = sesStorageGet("sale");
  // --------------------
  const [cartItems, setCartItems] = useStorage<CartItem[]>("basket", []);
  const [client, setClient] = useState(getClient);
  const pathShop = pathName(useLocation());
  const authUser: User = authService.authUser();
  const [seller, setSeller] = useState(true);
  // const [qtity, setQtity] = useState(0);

  const [modalProducts, setModalProducts] = useState(false);
  const [sale, setSale] = useState<Sale>(sesStorageGet("sale"));
  const shippingFee = sale?.shippingFee || 0;
  const otherFee = sale?.otherFee || 0;
  const discountRate = sale?.discountRate || 0;

  // --------------------
  const [clients, setClients] = useState<User[]>([getClient]);
  const fetchDatas = async () => {
    const { data } = await httpService.get("users");
    setClients(data);
  };
  useEffect(() => {
    fetchDatas();
    return () => {};
  }, [cartItems]);

  // --------------------

  useEffect(() => {
    if (pathShop === "proformacart") {
      sesStorageSet("isProforma", "isProforma");
    } else {
      sessionStorage.removeItem("isProforma");
    }
    // --------------------
    if (authUser && !isStaffSte(["cpa"], authUser.ste.name)) {
      setSeller(false);
      if (hasRole(["ceo"], authUser.role)) {
        sesStorageSet("client", authUser);
      } else {
        httpService.findById(authUser.clientId, "users").then((user) => {
          sesStorageSet("client", user);
        });
      }
      setClient(sesStorageGet("client"));
    }
    // --------------------
    setSale(getSale);
  }, [pathShop]);

  const getSaleRef = () => {
    if (sale) {
      return sale.ref;
    }
    return null;
  };

  const getTatolOfproducts = () => {
    return cartItems.length;
  };

  const getTatolQtities = () => {
    return hlpShop.getTotalQtityReal(cartItems);
  };

  const onModalProducts = () => {
    const toggle = !modalProducts;
    setModalProducts(toggle);
  };

  const getItemQtity = (product: Product) => {
    return cartItems.find((x) => x.product.id === product.id)?.qtityOdr || 0;
  };

  const incrementQtity = async (item: CartItem) => {
    const nCartItems = await hlpShop.updateCartQtity([...cartItems], item.product, +item.qtityOdr + 1);
    setCartItems(nCartItems);
    sesStorageSet("basket", nCartItems);
    return cartItems;
  };

  const decrementQtity = async (item: CartItem) => {
    const ifQtity = cartItems.find((x) => x.product.id === item.product.id)?.qtityOdr === 1;
    if (ifQtity) {
      const nCartItems = cartItems.filter((x) => x.product.id !== item.product.id);
      setCartItems(nCartItems);
      sesStorageSet("basket", nCartItems);
    } else {
      const nCartItems = await hlpShop.updateCartQtity([...cartItems], item.product, +item.qtityOdr - 1);
      setCartItems(nCartItems);
      sesStorageSet("basket", nCartItems);
    }

    return cartItems;
  };

  const addToCart = async (product: Product) => {
    hlpShop.addToCart(cartItems, product, 1).then((items) => {
      setCartItems(items);
    });
  };

  const addSpeUnitPrice = (product: Product, speUnitPrice: number) => {
    const index = cartItems.findIndex((item) => item.product.id === product.id);
    const nCartItems = [...cartItems];
    nCartItems[index].speUnitPrice = speUnitPrice;
    setCartItems(nCartItems);
    sesStorageSet("basket", nCartItems);
  };

  const addDiscount = (cartItems: CartItem[], item: CartItem) => {
    const index = cartItems.findIndex((x) => x.product.id === item.product.id);
    const nCartItems = [...cartItems];
    nCartItems[index].addDiscount = !addDiscount;
    setCartItems(nCartItems);
    sesStorageSet("basket", nCartItems);
  };

  const updateItemQtity = async (product: Product, qtity: number) => {
    const nCartItems = await hlpShop.updateCartQtity([...cartItems], product, qtity);
    setCartItems(nCartItems);
    sesStorageSet("basket", nCartItems);
    return cartItems;
  };

  const removeItemFormCart = (product: Product) => {
    const nCartItems = cartItems.filter((item) => item.product.id !== product.id);
    setCartItems(nCartItems);
    sesStorageSet("basket", nCartItems);
    return cartItems;
  };

  const removeAllFormCart = () => {
    setCartItems([]);
    hlpShop.removeAllFromCart(cartItems);
  };

  const getTotalTva = () => {
    return currencyFormatter(hlpShop.getTotalTva(cartItems, client));
  };

  const getTotalAmount = () => {
    return currencyFormatter(hlpShop.getTotalAmount(cartItems, client));
  };

  const getTotalAmountAllIncluded = () => {
    return currencyFormatter(hlpShop.getTotalAmountAllIncluded(cartItems, client, shippingFee, otherFee, discountRate));
  };
  const getTotalAmountDiscount = () => {
    return currencyFormatter(hlpShop.getTotalAmountDiscount(cartItems, client, discountRate));
  };

  const getSubTotal = () => {
    if (client) {
      return currencyFormatter(hlpShop.getTotalAmountWithoutTva(cartItems, client));
    }
    return null;
  };

  return (
    <ShopCartContext.Provider
      value={{
        addDiscount,
        addToCart,
        cartItems,
        client,
        clients,
        decrementQtity,
        discountRate,
        getItemQtity,
        getSaleRef,
        getSubTotal,
        getTatolOfproducts,
        getTatolQtities,
        getTotalAmount,
        getTotalAmountAllIncluded,
        getTotalAmountDiscount,
        getTotalTva,
        incrementQtity,
        modalProducts,
        addSpeUnitPrice,
        onModalProducts,
        otherFee,
        removeAllFormCart,
        removeItemFormCart,
        sale,
        setCartItems,
        setClient,
        setClients,
        setModalProducts,
        setSale,
        shippingFee,
        updateItemQtity,
      }}>
      {children}
    </ShopCartContext.Provider>
  );
};

// export default ShopCartContext;

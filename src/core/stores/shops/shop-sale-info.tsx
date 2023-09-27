import { sesStorageGet } from "asv-hlps";
import dayjs from "dayjs";
import { useEffect } from "react";

import DisplayWidget, { WidgetType } from "../../../shared/displays/display-widget";
import { useShopCartContext } from "./shop-cart-context";

const ShopSaleInfo = () => {
  const getSale = sesStorageGet("sale");
  const { getTatolOfproducts, getTotalAmountAllIncluded, client, sale, setSale, getTatolQtities } = useShopCartContext();
  const widgets: WidgetType[] = [
    { title: "n° client", content: client.username },
    { title: "nom du client", content: client.ste.name },
    { title: "n° nif", content: client?.ste?.nif || "aucun" },
  ];
  const widgets2: WidgetType[] = [
    { title: "nombre de produits", content: getTatolOfproducts() },
    { title: "nombre d'unite", content: getTatolQtities() },
    { title: "montant total", content: getTotalAmountAllIncluded() },
    // { title: "date", content: dateFormatter(sale.saleDate, "dmy","dmy", "/") },
    { title: "date", content: dayjs(sale?.saleDate).format(`DD/MM/YYYY HH:mm`) },
    { title: "n° de commande", content: sale?.ref },
  ];
  useEffect(() => {
    setSale(getSale);
  }, []);

  return (
    <>
      <DisplayWidget widgets={widgets} className="py-1 px-0" />
      <DisplayWidget widgets={widgets2} className="pt-1 px-0" />
    </>
  );
};

export default ShopSaleInfo;

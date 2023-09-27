import { useEffect, useState } from "react";

import httpService from "../../../services/httpService";
import DisplayWidget, { WidgetType } from "../../../shared/displays/display-widget";
import hlpProduct from "./helpers/hlpProduct";

const MemoProduct = () => {
  const [tobs, setTobs] = useState([]);
  // --------------------
  const fetchDatas = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.get("products");
    setTobs(tobs);
  };
  useEffect(() => {
    fetchDatas();
    return () => {};
  }, []);

  const widgets: WidgetType[] = [
    { title: "Nombre de Produit", content: tobs?.length || 0 },
    { title: "Stock totale", content: hlpProduct.stockTotal(tobs, "all") },
    { title: "Stock en magasin", content: hlpProduct.stockTotal(tobs, "store") },
    { title: "Stock reserve", content: hlpProduct.stockTotal(tobs, "depotsReserve") },
    { title: "Valeur estimée du stock", content: Math.floor(hlpProduct.stockTotal(tobs, "value")) },
  ];

  return <DisplayWidget widgets={widgets} />;
};

export default MemoProduct;

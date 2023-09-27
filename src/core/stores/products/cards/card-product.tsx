import { Product } from "asv-hlps";
import TabContainer from "asv-hlps-react/lib/cjs/reacts/tabs/tab-container";
import { IPath } from "asv-hlps/lib/cjs/models/types/Type";

import IdProduct from "./id-product";
import InProduct from "./in-product";
import LotProduct from "./lot-product";
import PriceProduct from "./price-product";
import PromoProduct from "./promo-product";
import SaledProduct from "./saled-product";
import StatProduct from "./stat-product";
import UgProduct from "./ug-product";

type TobType = {
  product: Product;
};

// const CardProduct = ({ product: tob }: TobType) => {
const CardProduct = ({ product }: TobType) => {
  /* const [product, setProduct] = useState<Product>(null);
  const fetchTobs = async () => {
    const { data } = await httpService.getByParam(tob.id, "products/edit");
    setProduct(data);
  };
  useEffect(() => {
    fetchTobs();
  }, []); */

  const contents: IPath[] = [
    {
      id: "card_stats_product",
      title: "stats",
      icon: "mdi mdi-chart-bar",
      Content: <StatProduct product={product} />,
    },
    {
      id: "card_saled_product",
      title: "ventes",
      icon: "mdi mdi-chart-bar",
      Content: <SaledProduct product={product} />,
    },
    {
      id: "card_promo_product",
      title: "promos",
      icon: "mdi mdi-chart-bar",
      Content: <PromoProduct product={product} />,
    },
    {
      id: "card_id_product",
      title: "identité",
      icon: "mdi mdi-chart-bar",
      Content: <IdProduct productId={+product?.id} />,
    },
    {
      id: "card_price_product",
      title: "tarification",
      icon: "mdi mdi-chart-bar",
      Content: <PriceProduct product={product} />,
    },
    {
      id: "card_in_product",
      title: "entrées",
      icon: "mdi mdi-chart-bar",
      Content: <InProduct product={product} />,
    },
    {
      id: "card_ug_product",
      title: "ugs",
      icon: "mdi mdi-chart-bar",
      Content: <UgProduct product={product} />,
    },
    {
      id: "card_lot_product",
      title: "lots",
      icon: "mdi mdi-chart-bar",
      Content: <LotProduct product={product} />,
    },
  ];
  return <>{product!! && <TabContainer defaultActiveKey={"card_stats_product"} tabs={contents} />}</>;
};

export default CardProduct;

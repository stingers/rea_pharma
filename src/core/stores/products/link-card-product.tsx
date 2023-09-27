import { Product } from "asv-hlps";

import LinkTob from "../../../shared/links/link-tob";
import CardProduct from "./cards/card-product";

type TobType = {
  product: Product;
  children?;
};
const LinkCardProduct = ({ product, children }: TobType) => {
  return (
    <>
      <LinkTob
        icon="fas fa-pen"
        tob={product}
        title={`${product?.designation} (${product?.ref})`}
        size="lg"
        content={<CardProduct product={product} />}>
        {children ? children : product?.designation}
      </LinkTob>
    </>
  );
};

export default LinkCardProduct;

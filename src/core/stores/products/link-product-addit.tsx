import { Product } from "asv-hlps";
import LinkTob from "asv-hlps-react/lib/cjs/reacts/links/link-tob";

import AdditProduct from "./addit-product";

type TobType = {
  product: Product;
};

const LinkProductAddit = ({ product }: TobType) => {
  return (
    <>
      <LinkTob title={product?.designation} tob={product} content={<AdditProduct tob={product} productId={product.id} />} size={"lg"}>
        {product?.designation}
      </LinkTob>
    </>
  );
};

export default LinkProductAddit;

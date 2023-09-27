import { Product } from "asv-hlps";
import { InputGroup } from "react-bootstrap";

import { CartItem } from "../shops/CartItem";
import { useShopCartContext } from "../shops/shop-cart-context";

type TobProps = {
  item?: CartItem;
  product: Product;
};

const BtnUpdateQtityProduct = ({ product, item }: TobProps) => {
  const { cartItems, incrementQtity, decrementQtity, setCartItems, getItemQtity, updateItemQtity, removeItemFormCart } =
    useShopCartContext();

  const handleQtity = async (e) => {
    const qtity = parseInt(e.target.value);
    updateItemQtity(product, qtity);
  };

  return (
    <form>
      <InputGroup size="sm">
        <InputGroup.Text className="text-danger" onClick={() => decrementQtity(item)}>
          <i className="fa fa-minus"></i>
        </InputGroup.Text>
        {/* <Form.Control */}
        <input
          // ref={qtityRef}
          className="form-control text-center "
          onChange={handleQtity}
          min={1}
          // name="item.qtityOdr"
          style={{ width: "70px" }}
          // value={item?.qtityOdr}
          // defaultValue={item.qtityOdr}
          defaultValue={cartItems.find((x) => x?.product.id === item?.product.id)?.qtityOdr}
          value={cartItems.find((x) => x?.product.id === item?.product.id)?.qtityOdr}
        />
        <InputGroup.Text className="text-success" onClick={() => incrementQtity(item)}>
          <i className="fa fa-plus"></i>
        </InputGroup.Text>
        <InputGroup.Text className="ms-1" style={{ backgroundColor: "transparent" }}>
          <i className="fa fa-trash text-danger" onClick={() => removeItemFormCart(item.product)}></i>
        </InputGroup.Text>
      </InputGroup>
    </form>
  );
};

export default BtnUpdateQtityProduct;

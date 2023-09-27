import InputProduct from "./input-product";
import { Product } from "asv-hlps/lib/cjs/models/entities/products/Product";
import React from "react";
import { Col, Row } from "react-bootstrap";

type TobProps = {
  products: Product[];
  onCloseAll?: () => void;
};

const InputListProduct = ({ products, onCloseAll }: TobProps) => {
  return (
    <Row>
      {React.Children.toArray(
        (products || []).map((product) => (
          <Col sm={6} md={4}>
            <InputProduct product={product} />
          </Col>
        ))
      )}
    </Row>
  );
};

export default InputListProduct;

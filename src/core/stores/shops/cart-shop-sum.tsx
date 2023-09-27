import { Sale, sesStorageSet } from "asv-hlps";
import { Table } from "react-bootstrap";

import { useShopCartContext } from "./shop-cart-context";

type TobProps = {
  sale?: Sale;
};

// const CartShopSum = ({ sale }: TobProps) => {
const CartShopSum = () => {
  const { getSubTotal, getTotalAmountAllIncluded, getTotalTva, sale, setSale, getTotalAmountDiscount } = useShopCartContext();

  const onDelShippingFee = () => {
    const nSale = { ...sale, shippingFee: 0 };
    sesStorageSet("sale", nSale);
    setSale(nSale);
  };

  const onDelOtherFee = () => {
    const nSale = { ...sale, otherFee: 0 };
    sesStorageSet("sale", nSale);
    setSale(nSale);
  };
  const onDelDiscount = () => {
    const nSale = { ...sale, discountRate: 0 };
    sesStorageSet("sale", nSale);
    setSale(nSale);
  };

  return (
    <>
      <Table className="table-sm table-striped">
        <tbody>
          {/* <!-- sub total --> */}
          <tr className="text-end">
            <th scope="col">Sub Total</th>
            <th scope="col">{getSubTotal()}</th>
          </tr>
          {/* <!-- total tva --> */}
          <tr className="text-end">
            <td>Tva </td>
            <td>{getTotalTva()}</td>
          </tr>
          {/*  <!-- discountRate --> */}
          {sale?.discountRate > 0 && (
            <tr className="text-end font-weight-bold">
              <td>Remise de {sale.discountRate} % </td>
              <td>
                {getTotalAmountDiscount()}
                <span className="ms-2">
                  <i className="fa fa-times " onClick={onDelDiscount}></i>
                </span>
              </td>
            </tr>
          )}
          {/* <!-- shippingFree --> */}

          {sale?.shippingFee > 0 && (
            <tr className="text-end">
              <td>Frais d'envoi </td>
              <td>
                {sale?.shippingFee}
                <span className="ms-2">
                  <i className="fa fa-times " onClick={onDelShippingFee}></i>
                </span>
              </td>
            </tr>
          )}
          {/* <!-- otherFee --> */}
          {sale?.otherFee > 0 && (
            <tr className="text-end">
              <td>Frais divers </td>
              <td>
                {sale.otherFee}
                <span className="ms-2">
                  <i className="fa fa-times " onClick={onDelOtherFee}></i>
                </span>
              </td>
            </tr>
          )}

          {/* <!-- total amount --> */}
          <tr className="text-end">
            <th className="text-dark">Montant TTC</th>
            <th>
              <span className="fw-bold "> {getTotalAmountAllIncluded()}</span>
            </th>
          </tr>
        </tbody>
      </Table>
      {/* <ListGroup className="list-group-flush list-group-sm">
      <ListGroupItem className="d-flex justify-content-between align-items-center ">
        bobo
        <div>bobo</div>
      </ListGroupItem>
      <ListGroupItem className="d-flex justify-content-between align-items-center ">
        bobo
        <div>bobo</div>
      </ListGroupItem>
    </ListGroup> */}
    </>
  );
};

export default CartShopSum;

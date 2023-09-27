import { dateFormatter, Product } from "asv-hlps";
import { colToolTip } from "asv-hlps-react";
import React from "react";
import { Card } from "react-bootstrap";

type TobType = {
  tob: Product;
};
const ListPromoProduct = ({ tob }: TobType) => {
  const onPromo = () => {};

  return (
    <Card className="bg-light ">
      <h5 className="mb-1 text-uppercase bg-light p-2">
        Promo
        <span onClick={onPromo}>
          <i className="fas fa-pen p-2 mx-1"></i>
        </span>
      </h5>
      <Card.Body>
        <div className="responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>DÉBUT</th>
                <th>FIN</th>
                <th>{colToolTip("Q.P", "Quantité en promo")}</th>
                <th>{colToolTip("Q.A", "Quantité achetée")}</th>
                <th>
                  <i className="fas fa-check-double"></i>{" "}
                </th>
                <th>
                  <i className="fas fa-cogs"></i>{" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {React.Children.toArray(
                tob?.store?.promos.map((tob) => {
                  return (
                    <tr>
                      <th>{dateFormatter(tob.startDate)}</th>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ListPromoProduct;

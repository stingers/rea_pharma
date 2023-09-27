import { dateFormatter, ProductPromo } from "asv-hlps";
import DisplayPopover from "asv-hlps-react/lib/cjs/reacts/displays/display-popover";
import React from "react";
import { Table } from "react-bootstrap";

type TobType = {
  promos: ProductPromo[];
};

const ProductPromoNotif = ({ promos }: TobType) => {
  return (
    // promos.length > 0 && (
    <DisplayPopover
      title={"Produit en promo"}
      placement="top"
      content={
        <Table className="table-sm table-striped">
          <tbody>
            {React.Children.toArray(
              promos.map((promo) => (
                <tr>
                  <th>
                    <span>
                      Du {dateFormatter(new Date(promo.startDate))} au {dateFormatter(new Date(promo.endDate))}
                    </span>
                    <span className="fw-bold">{promo.qtityPromo}</span> +<span className="ms-2 text-success">{promo.qtityFree}</span>
                  </th>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      }>
      <span className="pulse mx-3"></span>
    </DisplayPopover>
    // )
  );
};

export default ProductPromoNotif;

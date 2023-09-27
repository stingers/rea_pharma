import {
  currencyFormatter,
  getTotalAmountAllIncludedOnSale,
  getTotalAmountDiscountOnSale,
  getTotalAmountOnSale,
  getTotalAmountWithoutTvaOnSale,
  getTotalShippingOnSale,
  getTotalTvaOnSale,
  Sale,
} from "asv-hlps";

type TobType = {
  sale: Sale;
};

const SaleInfoAmount = ({ sale }: TobType) => {
  const totalAmountAllIncluded = () => {
    return !sale.isDelivering ? getTotalAmountAllIncludedOnSale(sale) : getTotalAmountAllIncludedOnSale(sale, true);
  };
  const totalAmountWithoutTva = () => {
    return !sale.isDelivering ? getTotalAmountWithoutTvaOnSale(sale) : getTotalAmountWithoutTvaOnSale(sale, true);
  };
  const totalAmountTva = () => {
    return !sale.isDelivering ? getTotalTvaOnSale(sale) : getTotalTvaOnSale(sale, true);
  };
  const totalAmount = () => {
    return !sale.isDelivering ? getTotalAmountOnSale(sale) : getTotalAmountOnSale(sale, true);
  };
  const discountAmount = () => {
    return !sale.isDelivering ? getTotalAmountDiscountOnSale(sale) : getTotalAmountDiscountOnSale(sale, true);
  };
  const totalAmountFee = () => {
    return getTotalShippingOnSale(sale);
  };

  return (
    <>
      <div className="row">
        <div className="col"></div>
        <div className="col-sm-4">
          <table className="table table-sm" width={"100%"}>
            <tbody>
              <tr>
                <th className="text-end pb-0">Sous Total</th>
                <th className="pb-0"> {currencyFormatter(totalAmountWithoutTva())}</th>
              </tr>
              <tr>
                <td className="text-end pb-0">Tva </td>
                <td className="pb-0">{currencyFormatter(totalAmountTva())}</td>
              </tr>
              {(discountAmount() > 0 || totalAmountFee() > 0) && (
                <tr>
                  <th className="text-dark pb-0">Total </th>
                  <th className="pb-0">{currencyFormatter(totalAmount())}</th>
                </tr>
              )}
              {discountAmount() > 0 && (
                <tr>
                  <td className="text-dark pb-0">Remise {sale.discountRate} % </td>
                  <td className="pb-0">{currencyFormatter(discountAmount())}</td>
                </tr>
              )}
              {totalAmountFee() > 0 && (
                <tr>
                  <td className="text-end pb-0">Total des frais </td>
                  <td className="pb-0">{currencyFormatter(totalAmountFee())}</td>
                </tr>
              )}
              <tr>
                <th className="text-end pb-0">Total TTC</th>
                <th>
                  <span className="pb-0 text-dark"> {currencyFormatter(totalAmountAllIncluded())}</span>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SaleInfoAmount;

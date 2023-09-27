import { Sale, getNbProductsOnSale, getTotalAmountAllIncludedOnSale, getTotalQtityOdrOrDlvrOnSale, getTotalQtityOnSale } from "asv-hlps";
import { getTotalQtityFreeOnSale } from "asv-hlps/lib/cjs/sale";
import dayjs from "dayjs";
import { Col, Row } from "react-bootstrap";
import DisplayWidget from "../../../shared/displays/display-widget";

type TobProps = {
  sale: Sale;
  // treat?:
};

const InfoSale = ({ sale }) => {
  const nbProducts = getNbProductsOnSale(sale);

  const totalAmountAllIncluded = !sale?.isDelivering ? getTotalAmountAllIncludedOnSale(sale) : getTotalAmountAllIncludedOnSale(sale, true);

  const totalQtityOdr = !sale?.isDelivering ? getTotalQtityOdrOrDlvrOnSale(sale) : getTotalQtityOdrOrDlvrOnSale(sale, true);

  const totalQtityDlvr = !sale?.isDelivering ? getTotalQtityOdrOrDlvrOnSale(sale) : getTotalQtityOdrOrDlvrOnSale(sale, true);

  const totalQtityFree = getTotalQtityFreeOnSale(sale);

  let totalQtity = !sale?.isDelivering ? getTotalQtityOnSale(sale) : getTotalQtityOnSale(sale, true);

  const displayTotalQtity = () => {
    if (sale.isBack) {
      return (totalQtity = totalQtityDlvr);
    } else {
      if (!totalQtityFree) {
        return totalQtityOdr;
      } else {
        return totalQtity + " = " + totalQtityOdr + " + " + totalQtityFree + "ug";
      }
    }
  };
  const widgets = [
    { title: "nombre de produits", content: nbProducts },
    { title: "Nombre d'unité:", content: displayTotalQtity() },
    { title: "montant total", content: totalAmountAllIncluded },
    { title: "date", content: dayjs(sale?.saleDate).format("DD/MM/YYYY mm:ss") },
    { title: "N° de commande", content: sale?.ref },
  ];
  return (
    <>
      <Row className="my-2">
        <Col>
          <h3 className="text-info text-center ">
            Commande N° {sale.ref} du {dayjs(sale?.saleDate).format("DD/MM/YYYY mm:ss")}
          </h3>
          <DisplayWidget widgets={widgets} />
        </Col>
      </Row>
    </>
  );
};

export default InfoSale;

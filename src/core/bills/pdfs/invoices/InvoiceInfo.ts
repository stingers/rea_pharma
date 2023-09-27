import {
  Bill,
  getNbFreezeOnBill,
  getNbPackagesOnBill,
  getNbProductsOnBill,
  getNbProductsOnSale,
  getTotalQtityOnBill,
  getTotalQtityOnSale,
  Sale,
} from "asv-hlps";
import dayjs from "dayjs";

export class InvoiceInfo {
  static sale(tob: Sale) {
    const totalQtity = getTotalQtityOnSale(tob);
    const nbProducts = getNbProductsOnSale(tob);
    const nbColis = tob.nbPackages;
    const nbFreeze = tob.nbFreeze;

    // const oWidth =  [ '*', '*', 75, 75, 75, 75];

    const tabTop = {
      width: "50%",
      table: {
        headerRows: 1,

        // widths: [ 125, 125, 125, '*' ],
        widths: ["*", "*", 75, 75, 75, 75],
        heights: [6],
        // widths: [ '16%', '16%', '16%', '16%' ],
        body: [
          [
            { text: "FACTURE N°", style: "headerText" },
            { text: "DATE", style: "headerText" },
            { text: "NBRE DE PDTS", style: "headerText" },
            { text: "QUANTITE TOTALE", style: "headerText" },
            { text: "NBRE COLIS", style: "headerText" },
            { text: "NBRE FROID", style: "headerText" },
          ],
          [
            { text: tob.ref, style: "rowText" },
            { text: dayjs(tob.createdAt).format("DD/MM/YYYY"), style: "rowText" },
            { text: nbProducts, style: "rowText" },
            { text: totalQtity, style: "rowText" },
            { text: nbColis, style: "rowText" },
            { text: nbFreeze, style: "rowText" },
          ],
        ],
      },
    };

    return tabTop;
  }

  static bill(tob: Bill) {
    const totalQtity = getTotalQtityOnBill(tob.sales);
    const nbProducts = getNbProductsOnBill(tob.sales);
    const nbColis = getNbPackagesOnBill(tob.sales);
    const nbFreeze = getNbFreezeOnBill(tob.sales);
    const oWidth = ["*", "*", 75, 75, 75, 75];

    const tabTop = {
      width: "50%",
      table: {
        headerRows: 1,

        // widths: [ 125, 125, 125, '*' ],
        widths: oWidth,
        heights: [6],
        // widths: [ '16%', '16%', '16%', '16%' ],
        body: [
          [
            { text: "FACTURE N°", style: "headerText" },
            { text: "DATE", style: "headerText" },
            { text: "NBRE DE PDTS", style: "headerText" },
            { text: "QUANTITE TOTALE", style: "headerText" },
            { text: "NBRE COLIS", style: "headerText" },
            { text: "NBRE FROID", style: "headerText" },
          ],
          [
            { text: tob.ref, style: "rowText" },
            { text: dayjs(tob.createdAt).format("DD/MM/YYYY"), style: "rowText" },
            { text: nbProducts, style: "rowText" },
            { text: totalQtity, style: "rowText" },
            { text: nbColis, style: "rowText" },
            { text: nbFreeze, style: "rowText" },
          ],
        ],
      },
    };

    return tabTop;
  }
}

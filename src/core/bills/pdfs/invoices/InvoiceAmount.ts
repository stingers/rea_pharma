import {
  Bill,
  currencyFormatterCfa,
  getTotalAmountAllIncludedOnBill,
  getTotalAmountAllIncludedOnSale,
  getTotalAmountTvaOnBill,
  getTotalAmountWithoutTvaOnBill,
  getTotalAmountWithoutTvaOnSale,
  getTotalShippingOnSale,
  getTotalTvaOnSale,
  Sale,
} from "asv-hlps";

export class InvoiceAmount {
  static infoBl(tob: Sale) {
    const totalAmountWithoutTva =
      tob.isBack && (tob.backChoice.toLowerCase() === "autre" || tob.rejectedReason)
        ? 0
        : currencyFormatterCfa(getTotalAmountWithoutTvaOnSale(tob, true));
    // const totalPort = currencyFormatterCfa(getTotalShipping(tob));
    const totalTva = currencyFormatterCfa(getTotalTvaOnSale(tob, true));
    const totalAmountAllIncluded =
      tob.isBack && (tob.backChoice.toLowerCase() === "autre" || tob.rejectedReason)
        ? 0
        : currencyFormatterCfa(getTotalAmountAllIncludedOnSale(tob, true));
    const tabFooter = {
      width: "50%",
      table: {
        headerRows: 1,

        // widths: [ 100, 100, 100, 100 ],
        widths: ["*", "*", "*", "*"],
        heights: [6],
        body: [
          [
            { text: "TOTAL HT", style: "headerText" },
            // {text: 'PORT HT', style: 'headerText'},
            { text: "TOTAL TVA", style: "headerText" },
            { text: "TOTAL TTC", style: "headerText" },
            { text: "NET A PAYER", style: "headerText" },
          ],
          [
            { text: totalAmountWithoutTva, style: "rowText", alignment: "center" },
            // { text: totalPort, style: 'rowText', alignment: 'center' },
            { text: totalTva, style: "rowText", alignment: "center" },
            { text: totalAmountAllIncluded, style: "rowText", alignment: "center" },
            { text: totalAmountAllIncluded, style: "rowText", alignment: "center" },
          ],
        ],
      },
    };

    return tabFooter;
  }
  static infoProforma(tob: Sale) {
    const totalAmountWithoutTva =
      tob.isBack && tob.backChoice.toLowerCase() === "autre" ? 0 : currencyFormatterCfa(getTotalAmountWithoutTvaOnSale(tob));
    // const totalPort = currencyFormatterCfa(getTotalShipping(tob));
    const totalTva = currencyFormatterCfa(getTotalTvaOnSale(tob));
    const totalAmountAllIncluded =
      tob.isBack && tob.backChoice.toLowerCase() === "autre" ? 0 : currencyFormatterCfa(getTotalAmountAllIncludedOnSale(tob));
    const tabFooter = {
      width: "50%",
      table: {
        headerRows: 1,

        // widths: [ 100, 100, 100, 100 ],
        widths: ["*", "*", "*", "*"],
        heights: [6],
        body: [
          [
            { text: "TOTAL HT", style: "headerText" },
            // {text: 'PORT HT', style: 'headerText'},
            { text: "TOTAL TVA", style: "headerText" },
            { text: "TOTAL TTC", style: "headerText" },
            { text: "NET A PAYER", style: "headerText" },
          ],
          [
            { text: totalAmountWithoutTva, style: "rowText", alignment: "center" },
            // { text: totalPort, style: 'rowText', alignment: 'center' },
            { text: totalTva, style: "rowText", alignment: "center" },
            { text: totalAmountAllIncluded, style: "rowText", alignment: "center" },
            { text: totalAmountAllIncluded, style: "rowText", alignment: "center" },
          ],
        ],
      },
    };

    return tabFooter;
  }

  static info(tob: Sale) {
    const totalAmountWithoutTva =
      tob.isBack && (tob.backChoice.toLowerCase() === "autre" || tob.rejectedReason)
        ? 0
        : currencyFormatterCfa(getTotalAmountWithoutTvaOnSale(tob, true));
    const totalPort = currencyFormatterCfa(getTotalShippingOnSale(tob));
    const totalTva = currencyFormatterCfa(getTotalTvaOnSale(tob, true));
    const totalAmountAllIncluded =
      tob.isBack && (tob.backChoice.toLowerCase() === "autre" || tob.rejectedReason)
        ? 0
        : currencyFormatterCfa(getTotalAmountAllIncludedOnSale(tob, true));
    const tabFooter = {
      width: "50%",
      table: {
        headerRows: 1,

        // widths: [ 100, 100, 100, 100 ],
        widths: ["*", "*", "*", "*", "*"],
        heights: [6],
        body: [
          [
            { text: "TOTAL HT", style: "headerText" },
            { text: "PORT HT", style: "headerText" },
            { text: "TOTAL TVA", style: "headerText" },
            { text: "TOTAL TTC", style: "headerText" },
            { text: "NET A PAYER", style: "headerText" },
          ],
          [
            { text: totalAmountWithoutTva, style: "rowText", alignment: "center" },
            { text: totalPort, style: "rowText", alignment: "center" },
            { text: totalTva, style: "rowText", alignment: "center" },
            { text: totalAmountAllIncluded, style: "rowText", alignment: "center" },
            { text: totalAmountAllIncluded, style: "rowText", alignment: "center" },
          ],
        ],
      },
    };

    return tabFooter;
  }
  static infoBill(tob: Bill) {
    const totalAmountAllAndBackInclused = getTotalAmountAllIncludedOnBill(tob.sales);
    const totalAmountWithoutTvaAllAndBack = getTotalAmountWithoutTvaOnBill(tob.sales);
    const totalAmountTvaAllAndBack = getTotalAmountTvaOnBill(tob.sales);
    // const totalAmountWithoutTva = currencyFormatterCfa(getTotalAmountWithoutTvaOnBill(tob.sales));
    const totalAmountWithoutTva = currencyFormatterCfa(totalAmountWithoutTvaAllAndBack);
    // const totalPort = currencyFormatterCfa(getTotalShipping(tob));
    const totalTva = currencyFormatterCfa(totalAmountTvaAllAndBack);
    // const totalTva = currencyFormatterCfa(getTotalAmountTvaOnBill(tob.sales));
    // const totalAmountAllIncluded = currencyFormatterCfa(getTotalAmountOnBill(tob.sales));
    const totalAmountAllIncluded = currencyFormatterCfa(totalAmountAllAndBackInclused);
    const tabFooter = {
      width: "50%",
      table: {
        headerRows: 1,

        // widths: [ 100, 100, 100, 100 ],
        widths: ["*", "*", "*", "*"],
        heights: [6],
        body: [
          [
            { text: "TOTAL HT", style: "headerText" },
            // {text: 'PORT HT', style: 'headerText'},
            { text: "TOTAL TVA", style: "headerText" },
            { text: "TOTAL TTC", style: "headerText" },
            { text: "NET A PAYER", style: "headerText" },
          ],
          [
            { text: totalAmountWithoutTva, style: "rowText", alignment: "center" },
            // { text: totalPort, style: 'rowText', alignment: 'center' },
            { text: totalTva, style: "rowText", alignment: "center" },
            { text: totalAmountAllIncluded, style: "rowText", alignment: "center" },
            { text: totalAmountAllIncluded, style: "rowText", alignment: "center" },
          ],
        ],
      },
    };

    return tabFooter;
  }
}

import {
  Bill,
  currencyFormatter,
  currencyFormatterCfa,
  getFullname,
  getSteShortname,
  getTotalAmountAllIncludedOnSale,
  getTotalAmountTvaOnBill,
  getTotalAmountWithoutTvaOnBill,
  Sale,
  SaleProduct,
  SaleProductLot,
} from "asv-hlps";
import dayjs from "dayjs";

export class PdfBillTables {
  static listBillTable(table: Bill[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "*", "auto", 60, 45, 60, 60],
        heights: [6],
        body: [
          this.headListBillTable(),

          ...table.map((tob, i) => {
            // const client  =  AngUtils.userFullname(tob.client);
            const client = getSteShortname(tob.client.ste, ["pharmacie", "clinique", "hopital"]) || getFullname(tob.client);
            const totalAmount = currencyFormatter(Math.ceil(tob.totalAmount));
            const dueAmount = currencyFormatter(Math.ceil(tob.dueAmount));
            const totalAmountTva = currencyFormatter(Math.ceil(getTotalAmountTvaOnBill(tob.sales)));
            const totalAmountHt = currencyFormatter(Math.ceil(getTotalAmountWithoutTvaOnBill(tob.sales)));
            return [
              { text: i + 1, style: "rowText" },
              { text: tob.ref, style: "rowText", alignment: "center" },
              { text: client, style: "rowText" },
              { text: dayjs(tob.createdAt).format("DD/MM/YYYY"), style: "rowText", alignment: "center" },
              { text: totalAmountHt, style: "rowText", alignment: "right" },
              { text: totalAmountTva, style: "rowText", alignment: "right" },
              { text: totalAmount, style: "rowText", alignment: "right" },
              { text: dueAmount, style: "rowText", alignment: "right" },
            ];
          }),
        ],
      },

      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static statlistBillTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "*", "auto", 70, 70],
        heights: [6],
        body: [
          [
            { text: "#", style: "headerText" },
            { text: "ID", style: "headerText", alignment: "center" },
            { text: "Client", style: "headerText" },
            { text: "Montant total", style: "headerText", alignment: "center" },
            { text: "Impayés", style: "headerText", alignment: "center" },
            { text: "Payés", style: "headerText", alignment: "center" },
          ],

          ...table.map((tob, i) => {
            return [
              { text: i + 1, style: "rowText" },
              { text: tob.username, style: "rowText", alignment: "center" },
              { text: tob.steName, style: "rowText" },
              { text: tob.totalAmount, style: "rowText", alignment: "right" },
              { text: tob.totalNopaid, style: "rowText", alignment: "right" },
              { text: tob.totalPaid, style: "rowText", alignment: "right" },
            ];
          }),
        ],
      },

      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static listBillForClientTable(table: Bill[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "*", "auto", 60, 85, 85, 85],
        heights: [6],
        body: [
          [
            { text: "#", style: "headerText" },
            { text: "Ref", style: "headerText" },
            { text: "Date d'emission", style: "headerText", alignment: "center" },
            { text: "Montant H.T", style: "headerText", alignment: "center" },
            { text: "Montant Tva", style: "headerText", alignment: "center" },
            { text: "Montant TTC", style: "headerText", alignment: "center" },
            { text: "Solde à payer", style: "headerText", alignment: "center" },
          ],

          ...table.map((tob, i) => {
            // const client  =  AngUtils.userFullname(tob.client);
            const client = getSteShortname(tob.client.ste, ["pharmacie", "clinique", "hopital"]) || getFullname(tob.client);
            // const totalAmount = currencyFormatterCfa(Math.ceil(tob.totalAmount));
            const totalAmount = Math.ceil(tob.totalAmount);
            // const dueAmount = currencyFormatterCfa(Math.ceil(tob.dueAmount));
            const dueAmount = Math.ceil(tob.dueAmount);
            // const totalAmountTva = currencyFormatterCfa(Math.ceil( getTotalAmountTvaOnBill(tob.sales)));
            const totalAmountTva = Math.ceil(getTotalAmountTvaOnBill(tob.sales));
            // const totalAmountHt = currencyFormatterCfa(Math.ceil( getTotalAmountWithoutTvaOnBill(tob.sales)));
            const totalAmountHt = Math.ceil(getTotalAmountWithoutTvaOnBill(tob.sales));
            return [
              { text: i + 1, style: "rowText" },
              { text: tob.ref, style: "rowText", alignment: "center" },
              // {text: client, style: 'rowText',},
              { text: dayjs(tob.createdAt).format("DD/MM/YYYY"), style: "rowText", alignment: "center" },

              { text: totalAmountHt, style: "rowText", alignment: "right" },
              { text: totalAmountTva, style: "rowText", alignment: "right" },
              { text: totalAmount, style: "rowText", alignment: "right" },
              { text: dueAmount, style: "rowText", alignment: "right" },
            ];
          }),
        ],
      },

      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static listBillDetailTable(table: Sale[]) {
    const sales: any[] = [];
    // const salesBack: any[] = [];
    for (const sale of table) {
      /*  }
      for (let i = 0; i < table.length; i++) { */
      // const sale = table[i];
      const pdfSale = {
        ref: sale.ref,
        saleDate: dayjs(sale.saleDate).format("DD/MM/YYYY"),
        totalAmount: currencyFormatterCfa(getTotalAmountAllIncludedOnSale(sale, true)),
        /* totalAmount: !(sale.isBack && sale.backChoice.toLowerCase() === 'avoir') ?
                    currencyFormatterCfa(getTotalAmountAllIncluded(sale, true)) :
                    '-' + currencyFormatterCfa(getTotalAmountBack(sale)) */
      };
      sales.push(pdfSale);
      // if(sale.hasBack ) {
      /* if (sale.hasBack) {
              const pdfSale2 = {
                ref: 'R-' + sale.ref,
                saleDate: dayjs(sale.saleBacks[0].createdAt).format('DD/MM/YYYY'),
                totalAmount: '-' + currencyFormatterCfa(getTotalAmountBack(sale))
              };

              sales.push(pdfSale2);
            } */
    }

    return {
      table: {
        headerRows: 1,
        widths: ["auto", "*", "auto", 70],

        body: [
          [
            { text: "#", style: "headerText" },
            { text: "Ref", style: "headerText" },
            // { text: 'Ref commande', bold: true },
            { text: "Date d'emission", style: "headerText" },
            { text: "Montant", style: "headerText" },
            // { text: 'Status', bold: true },
          ],

          // ...table.map(
          ...sales.map((tob, i) => {
            // const client  =  AngUtils.userFullname(tob.client);
            // const saleDate = dayjs(tob.saleDate).format('DD/MM/YYYY');
            // const totalAmount = currencyFormatterCfa(getTotalAmountAllIncluded(tob, true));
            return [
              { text: i + 1, style: "rowText" },
              { text: tob.ref, style: "rowText" },
              { text: tob.saleDate, style: "rowText" },
              { text: tob.totalAmount, /* bold: true, */ alignment: "right", style: "rowText" },
            ];
          }),
        ],
      },

      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static invoiceTablePhcie(table: SaleProduct[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "*", 35, "auto", "auto", "auto", "auto", "auto", "auto", 35],

        heights: [6],

        body: [
          // ------ table header ------
          this.tableHead([{ text: "PP", style: "headerText" }]),
          // ------ table ------
          ...table.map((sp, i) => {
            const amountQtityDlvr = currencyFormatter(sp.qtityDlvr * sp.unitPrice);
            const unitPrice = sp.unitPrice ? currencyFormatter(Math.ceil(sp.unitPrice)) : "";
            const publicPrice = sp.publicPrice ? currencyFormatter(Math.ceil(sp.publicPrice)) : "";
            const qtityReal = !sp.qtityFree ? sp.qtityDlvr : sp.qtityDlvr + " + " + sp.qtityFree + " ug ";
            // const lot = sp.lot.substring(0,  sp.lot.indexOf('=>')).trim()

            // --------------------
            let lotsName = this.getLotsName(sp.lots);
            // --------------------

            let lotsExp = this.getLotsExp(sp.lots);

            return [
              { text: i + 1, style: "rowText" },
              { text: sp.product.designation, style: "rowText" },
              { text: unitPrice, style: "rowText", alignment: "right" },
              { text: sp.qtityOdr, style: "rowText", alignment: "center" },
              //  {text: sp.qtityDlvr , style: 'rowText', alignment: 'center'},
              { text: qtityReal, style: "rowText", alignment: "center" },
              { text: sp.tva, style: "rowText", alignment: "right" },
              { text: amountQtityDlvr, style: "rowText", alignment: "right" },
              { text: lotsName, style: "rowText", alignment: "right" },
              { text: lotsExp, style: "rowText", alignment: "right" },
              { text: publicPrice, style: "rowText", alignment: "right" },
              //  sp.lot
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 1 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static invoiceTable(table: SaleProduct[]) {
    table = this.sortBySaleProductsProductDesignation(table);
    return {
      table: {
        headerRows: 1,
        // widths: [ 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: ["auto", "*", 45, "auto", "auto", "auto", "auto", "auto", "auto"],
        heights: [8],

        body: [
          this.tableHead(),

          /* [

            { text: '#', style: 'headerText' },
            { text: 'DESIGNATION', style: 'headerText' },
            { text: 'PRIX U', style: 'headerText'},
            { text: 'QTE CDEE', style: 'headerText'},
            { text: 'QTE LIVREE', style: 'headerText'},
            { text: 'TVA', style: 'headerText'},
            { text: 'MONTANT HT', style: 'headerText'},
            // { text: 'PP', style: 'headerText'},

          ], */

          ...table.map((sp, i) => {
            // const amountSp = sp.qtity * sp.unitPrice;
            const amountQtityDlvr = sp.qtityDlvr * sp.unitPrice;
            const unitPrice = sp.unitPrice ? Math.ceil(sp.unitPrice) : "";
            const qtityReal = !sp.qtityFree ? sp.qtityDlvr : sp.qtityDlvr + " + " + sp.qtityFree + " ug ";
            // --------------------
            let lotsName = this.getLotsName(sp.lots);
            // --------------------

            let lotsExp = this.getLotsExp(sp.lots);

            return [
              { text: i + 1, style: "rowText" },
              //  sp.product.ref,
              { text: sp.product.designation, style: "rowText" },
              { text: unitPrice, style: "rowText" },
              { text: sp.qtityOdr, style: "rowText" },
              { text: qtityReal, style: "rowText" },
              { text: sp.tva, style: "rowText" },
              { text: amountQtityDlvr, style: "rowText" },
              { text: lotsName, style: "rowText", alignment: "right" },
              { text: lotsExp, style: "rowText", alignment: "right" },

              //  publicPrice,
              //  sp.lot

              /* sp.product.publicPrice,
                 sp.qtity, */
              //  (sp.qtity * sp.unitPrice)
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 1 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static invoiceBlTable(table: SaleProduct[]) {
    return {
      table: {
        headerRows: 1,
        // widths: [ 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: ["auto", "*", "auto", "auto", "auto", "auto"],
        heights: [8],

        body: [
          this.tableBlHead(),

          /* [

            { text: '#', style: 'headerText' },
            { text: 'DESIGNATION', style: 'headerText' },
            { text: 'PRIX U', style: 'headerText'},
            { text: 'QTE CDEE', style: 'headerText'},
            { text: 'QTE LIVREE', style: 'headerText'},
            { text: 'TVA', style: 'headerText'},
            { text: 'MONTANT HT', style: 'headerText'},
            // { text: 'PP', style: 'headerText'},

          ], */

          ...table.map((sp, i) => {
            // const amountSp = sp.qtity * sp.unitPrice;
            const amountQtityDlvr = sp.qtityDlvr * sp.unitPrice;
            const unitPrice = sp.unitPrice ? Math.ceil(sp.unitPrice) : "";
            const qtityReal = !sp.qtityFree ? sp.qtityDlvr : sp.qtityDlvr + " + " + sp.qtityFree + " ug ";
            // --------------------
            let lotsName = this.getLotsName(sp.lots);
            // --------------------
            let lotsExp = this.getLotsExp(sp.lots);

            return [
              { text: i + 1, style: "rowText" },
              //  sp.product.ref,
              { text: sp.product.designation, style: "rowText" },
              //  {text: unitPrice, style: 'rowText'},
              { text: sp.qtityOdr, style: "rowText" },
              { text: qtityReal, style: "rowText" },
              //  {text: sp.tva, style: 'rowText'},
              //  {text: amountQtityDlvr, style: 'rowText'},
              { text: lotsName, style: "rowText", alignment: "right" },
              { text: lotsExp, style: "rowText", alignment: "right" },

              //  publicPrice,
              //  sp.lot

              /* sp.product.publicPrice,
                 sp.qtity, */
              //  (sp.qtity * sp.unitPrice)
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 1 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static invoiceProformaTable(table: SaleProduct[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "*", "auto", "auto", "auto", "auto", "auto"],
        heights: [8],

        body: [
          // this.tableHead(),

          [
            { text: "#", style: "headerText" },
            { text: "DESIGNATION", style: "headerText" },
            { text: "PRIX U", style: "headerText" },
            { text: "QTE CDEE", style: "headerText" },
            { text: "QTE LIVREE", style: "headerText" },
            { text: "TVA", style: "headerText" },
            { text: "MONTANT HT", style: "headerText" },
            // { text: 'PP', style: 'headerText'},
          ],

          ...table.map((sp, i) => {
            // const amountSp = sp.qtity * sp.unitPrice;
            const amountQtity = currencyFormatter(Math.ceil(sp.qtityOdr * sp.unitPrice));
            const unitPrice = sp.unitPrice ? currencyFormatter(Math.ceil(sp.unitPrice)) : "";
            // const publicPrice = (sp.product.publicPrice) ? Math.ceil(sp.product.publicPrice)  : '';

            // const

            return [
              { text: i + 1, style: "rowText" },
              //  sp.product.ref,
              { text: sp.product.designation, style: "rowText" },
              { text: unitPrice, style: "rowText", alignment: "right" },
              { text: sp.qtityOdr, style: "rowText", alignment: "center" },
              { text: sp.qtityDlvr, style: "rowText" },
              { text: sp.tva, style: "rowText" },
              //  {text: amountQtity, style: 'rowText', alignment: 'right'},
              { text: amountQtity, style: "rowText", alignment: "right" },
              //  publicPrice,
              //  sp.lot

              /* sp.product.publicPrice,
                 sp.qtity, */
              //  (sp.qtity * sp.unitPrice)
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 1 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  private static tableHead(tabHead: any[] = []) {
    return [
      { text: "#", style: "headerText" },
      { text: "DESIGNATION", style: "headerText" },
      { text: "PRIX U", style: "headerText" },
      { text: "Q CDEE", style: "headerText" },
      { text: "Q LIVREE", style: "headerText" },
      { text: "TVA", style: "headerText" },
      { text: "MONTANT HT", style: "headerText" },
      { text: "LOT", style: "headerText" },
      { text: "EXP", style: "headerText" },
      ...tabHead,
      // { text: 'PP', style: 'headerText'},
    ];
  }

  private static tableBlHead(tabHead: any[] = []) {
    return [
      { text: "#", style: "headerText" },
      { text: "DESIGNATION", style: "headerText" },
      // { text: 'PRIX U', style: 'headerText'},
      { text: "Q CDEE", style: "headerText" },
      { text: "Q LIVREE", style: "headerText" },
      // { text: 'TVA', style: 'headerText'},
      // { text: 'MONTANT HT', style: 'headerText'},
      { text: "LOT", style: "headerText" },
      { text: "EXP", style: "headerText" },
      ...tabHead,
      // { text: 'PP', style: 'headerText'},
    ];
  }

  private static headListBillTable() {
    return [
      { text: "#", style: "headerText" },
      { text: "Ref", style: "headerText" },
      { text: "Client", style: "headerText" },
      { text: "Date d'emission", style: "headerText", alignment: "center" },
      { text: "Montant H.T", style: "headerText", alignment: "center" },
      { text: "Montant Tva", style: "headerText", alignment: "center" },
      { text: "Montant TTC", style: "headerText", alignment: "center" },
      { text: "Solde à payer", style: "headerText", alignment: "center" },
    ];
  }

  private static getLotsName(lots: SaleProductLot[]) {
    if (!lots) {
      return "";
    }
    let lotsName: string[] = [];

    lots.map((lot) => {
      const x = lot.lot + "\n";
      lotsName.push(x);
    });
    return lotsName.toString() || "";
  }

  private static getLotsExp(lots: SaleProductLot[]) {
    if (!lots) {
      return "";
    }
    let lotsExp: string[] = [];

    lots.map((lot) => {
      const x = dayjs(lot.lotExp).format("DD/MM/YY") + "\n";
      lotsExp.push(x);
    });
    return lotsExp.toString() || "";
  }
  private static sortBySaleProductsProductDesignation(saleProducts: SaleProduct[]) {
    // this.sale.saleProducts.sort((a, b) => {
    return saleProducts.sort((a, b) => {
      const keyA = a.product.designation;
      const keyB = b.product.designation;
      return keyA.localeCompare(keyB);
    });
  }
}

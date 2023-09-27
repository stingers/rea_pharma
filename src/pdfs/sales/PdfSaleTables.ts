import { getTotalAmountAllIncludedOnSale, Sale, SaleProduct } from "asv-hlps";
import dayjs from "dayjs";

export class PdfSaleTables {
  static detailSaleTable(table: SaleProduct[]) {
    return {
      table: {
        headerRows: 1,
        widths: [15, "auto", "auto", "auto", "auto", "auto", "auto"],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "PU", bold: true },
            { text: "PP", bold: true },
            { text: "Qtity", bold: true },
            { text: "Montant", bold: true },
            // { text: 'Format', bold: true },
          ],

          ...table.map((sp, i) => {
            return [
              i + 1,
              sp.product.ref,
              sp.product.designation,
              sp.product.unitPrice,
              sp.publicPrice,
              sp.qtityDlvr,
              sp.qtityDlvr * sp.unitPrice,
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

  static listSale(table: Sale[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "*", "auto", "auto"],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Date d'émission", bold: true },
            { text: "Id Client", bold: true },
            { text: "Montant", bold: true },
            // { text: 'Format', bold: true },
          ],

          ...table.map((sale, i) => {
            const saleDate = dayjs(sale.saleDate).format("DD/MM/YYYY : HH:MM:SS");
            const totalAmountAllIncluded = getTotalAmountAllIncludedOnSale(sale);
            return [
              i + 1,
              sale.ref,
              saleDate,
              // s.product.loc.name,
              sale.client.username,
              totalAmountAllIncluded,

              // s.qtityDelivered
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

  static listSaleDelivered(table: Sale[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "*", "auto", "auto", "auto"],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Date d'émission", bold: true },
            { text: "Id Client", bold: true },
            { text: "Montant", bold: true },
            { text: "Date de livraison", bold: true },
            // { text: 'Format', bold: true },
          ],

          ...table.map((sale, i) => {
            const saleDate = dayjs(sale.saleDate).format("DD/MM/YYYY : HH:MM:SS");
            const deliveredDate = dayjs(sale.deliveredDate).format("DD/MM/YYYY : HH:MM:SS");
            const totalAmountAllIncluded = getTotalAmountAllIncludedOnSale(sale);
            return [
              i + 1,
              sale.ref,
              saleDate,
              // s.product.loc.name,
              sale.client.username,
              totalAmountAllIncluded,
              deliveredDate,

              // s.qtityDelivered
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

  static listZoneSale(table: Sale[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "*", "auto", 30, 30, 60],
        // heights: [10,70],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            // { text: 'Id Client', bold: true },
            { text: "Nom", bold: true },
            { text: "Date", bold: true },
            { text: "Colis", bold: true },
            { text: "Froid", bold: true },
            { text: "Heure", bold: true },
            // { text: 'Parafe', bold: true },
          ],

          ...table.map((sale, i) => {
            // const saleDate = dayjs(sale.saleDate).format('DD/MM/YYYY : HH:MM:SS');
            const saleDate = dayjs(sale.saleDate).format("DD/MM/YYYY");
            // const totalAmountAllIncluded = getTotalAmountAllIncludedOnSale(sale);
            // const totalAmountAllIncluded = currencyFormatterCfa(Math.ceil(getTotalAmountAllIncludedOnSale(sale)));
            // const saleRef = sale.ref;
            return [
              i + 1,
              { text: sale.ref + "\n\n\n\n\n" },
              // sale.client.username,
              sale.client.ste.name,
              saleDate,
              sale.nbPackages,
              sale.nbFreeze,
              // s.product.loc.name,
              // totalAmountAllIncluded,
              { text: " " },
              // { text: ' '},

              // s.qtityDelivered
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
  static detailSaleForMagTable(table: SaleProduct[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "*", "auto", "auto", "auto", 25, 25, 25],

        body: [
          [
            { text: "#", bold: true },
            // { text: 'Ref', bold: true },
            { text: "Designation", bold: true },
            { text: "Emplacement", bold: true },
            { text: "Lot", bold: true },
            { text: "Qtity", bold: true },
            { text: "UG", bold: true },
            { text: "Q.T", bold: true },
            { text: "Q.C", bold: true },
            // { text: 'Format', bold: true },
          ],

          ...table.map((sp, i) => {
            const lots = sp.lots
              ? sp.lots.map((x) => {
                  return x.lot + " => " + x.qtityOut;
                })
              : "";
            // let loc;
            // if(sp.product.loc) { loc = sp.product.loc.name; } else { loc = ' ' ; }
            const loc = sp.product.loc ? sp.product.loc.name : "";
            // const qtityDlvr = sp.qtityDlvr ? sp.qtityDlvr : "";
            // const lot = (sp.lot) ?  sp.lot : '' ;
            const qtityOdr = sp.qtityOdr;
            const qtityFree = sp.qtityFree;
            const totalQtity = sp.qtityOdr + (sp.qtityFree || 0);
            const qtityFund = "";
            // const qtityD =
            return [
              i + 1,
              // sp.product.ref,
              sp.product.designation,
              // sp.product.loc.name,
              loc,
              lots,
              qtityOdr,
              qtityFree,
              totalQtity,
              // qtityDelivered,
              qtityFund,
              // sp.qtityDelivered
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
}

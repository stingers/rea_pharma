import { BillPayment, currencyFormatterCfa, Product, ProductAmm, SaleProduct, Spent, User } from "asv-hlps";
import dayjs from "dayjs";

export class PdfTables {
  static mvtTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: [15, "*", "*", "*"],

        body: [
          [
            { text: "#", bold: true },
            { text: "Date de creation", bold: true },
            { text: "Reférence du mvt", bold: true },
            { text: "Par", bold: true },
          ],

          ...table.map((mvt, i) => {
            return [i + 1, dayjs(mvt.createdAt).format("MM/DD/YYYY"), mvt.ref, mvt.author.lastname];
          }),
        ],
      },
    };
  }

  static listSpentTable(table: any[]) {
    // const amount  = currencyFormatterCfa()

    return {
      table: {
        headerRows: 1,
        widths: [15, "auto", "auto", "*", "auto", "auto"],

        body: [
          [
            { text: "#", bold: true },
            { text: "Date de creation", bold: true },
            { text: "Reférence", bold: true },
            { text: "Description", bold: true },
            { text: "Montant", bold: true },
            { text: "A", bold: true },
          ],

          ...table.map((tob, i) => {
            return [i + 1, dayjs(tob.spentDate).format("MM/DD/YYYY"), tob.ref, tob.description, currencyFormatterCfa(tob.amount), tob.via];
          }),
        ],
      },
    };
  }

  static productTable(table: Product[]) {
    return {
      table: {
        headerRows: 1,
        // widths: [ 15, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: [15, "*", "*", "auto", "auto", "auto", "auto", "auto"],
        // widths: [ 15, '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%' ],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "PU", bold: true },
            { text: "PP", bold: true },
            { text: "Stock", bold: true },
            { text: "Categorie", bold: true },
            { text: "Format", bold: true },
          ],

          ...table.map((pdt, i) => {
            const designation = pdt.designation ? pdt.designation : "";
            const unitPrice = pdt.unitPrice ? pdt.unitPrice : 0;
            const publicPrice = pdt.publicPrice ? pdt.publicPrice : 0;
            const catName = pdt.cat ? pdt.cat.name : "";
            const sofName = pdt.sof ? pdt.sof.name : "";
            return [i + 1, pdt.ref, designation, unitPrice, publicPrice, pdt.stock, catName, sofName];
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

  static productAmmTable(table: ProductAmm[]) {
    return {
      table: {
        headerRows: 1,
        // widths: [ 15, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: ["auto", "*", "*", "auto", "auto", "auto"],
        // widths: [ 15, '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%' ],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "Code", bold: true },
            { text: "Debut", bold: true },
            { text: "Fin", bold: true },
          ],

          ...table.map((tob, i) => {
            const designation = tob.product.designation ? tob.product.designation : "";
            const ref = tob.product.ref ? tob.product.ref : "";

            return [i + 1, ref, designation, tob.code, dayjs(tob.startDate).format("DD-MM-YYYY"), dayjs(tob.endDate).format("DD-MM-YYYY")];
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

  static statBillsTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        // widths: [ 15, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: [15, "*", "*", "auto", "auto", "auto", "auto", "auto"],
        // widths: [ 15, '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%' ],

        body: [
          [
            { text: "#", bold: true },
            { text: "Société", bold: true },
            { text: "Total facture", bold: true },
            { text: "Total impayé", bold: true },
            { text: "Total payé", bold: true },
          ],

          ...table.map((pdt, i) => {
            const designation = pdt.designation ? pdt.designation : "";
            const unitPrice = pdt.unitPrice ? pdt.unitPrice : 0;
            const publicPrice = pdt.publicPrice ? pdt.publicPrice : 0;
            const catName = pdt.cat ? pdt.cat.name : "";
            const sofName = pdt.sof ? pdt.sof.name : "";
            return [i + 1, pdt.ref, designation, unitPrice, publicPrice, pdt.stock, catName, sofName];
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

  static bilanIncomesTable(table: BillPayment[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", 55, "*", "auto", "auto", "auto"],

        body: [
          [
            { text: "#", bold: true },
            { text: "Date", bold: true },
            { text: "Client", bold: true },
            { text: "N° Facture", bold: true },
            { text: "Mode", bold: true },
            { text: "Montant", bold: true },
          ],

          ...table.map((item, i) => {
            const username = item.bill.client.username + " (" + item.bill.client?.ste?.name + ")";
            return [
              i + 1,
              dayjs(item.paymentDate).format("DD/MM/YY"),
              // item.bill.client.username,
              username,
              item.bill.ref,
              item.method.name,
              item.paidAmount,
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

  static bilanSpendingTable(table: Spent[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", 55, "*", "auto"],

        body: [
          [
            { text: "#", bold: true },
            { text: "Date", bold: true },
            { text: "Description", bold: true },
            { text: "Montant", bold: true },
          ],

          ...table.map((item, i) => {
            return [
              i + 1,
              dayjs(item.createdAt).format("DD/MM/YY"),
              // item.bill.client.username,
              item.description,
              item.amount,
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

  static detailSaleMagTable(table: SaleProduct[]) {
    return {
      table: {
        headerRows: 1,
        widths: [15, "auto", "auto", "auto", "auto", "auto"],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "Emplacement", bold: true },
            { text: "Lot", bold: true },
            { text: "Qtity", bold: true },
            { text: "Qtity délivrée", bold: true },
            // { text: 'Format', bold: true },
          ],

          ...table.map((sp, i) => {
            return [i + 1, sp.product.ref, sp.product.designation, sp.product.loc.name, sp.lot, sp.qtityOdr, sp.qtityDlvr];
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

  static billPaymentTable(table: BillPayment[]) {
    return {
      table: {
        headerRows: 1,
        widths: [15, "auto", "auto", "auto", "auto", "auto", "auto" /*, 'auto', 'auto' */],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref facture", bold: true },
            { text: "Date", bold: true },
            { text: "Montant", bold: true },
            { text: "Mode", bold: true },
            { text: "N° de Chéque", bold: true },
            { text: "Banque", bold: true },
            // { text: 'Montant', bold: true },
            // { text: 'Solde à payer', bold: true },
            // { text: 'Status', bold: true },
          ],

          ...table.map((tob, i) => {
            const bank = tob?.bank ? tob.bank.name : "";

            return [i + 1, tob.bill.ref, tob.paymentDate, tob.paidAmount, tob.method.name, tob.checkNumber, bank];
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

  static userTable(table: User[]) {
    return {
      table: {
        headerRows: 1,
        widths: [15, "auto", "auto", "auto", "auto", "auto", "auto" /* , '*' */],

        body: [
          [
            { text: "#", bold: true },
            { text: "ID", bold: true },
            { text: "Ste", bold: true },
            { text: "Nif", bold: true },
            { text: "Responsable", bold: true },
            { text: "Email", bold: true },
            { text: "Phone", bold: true },
            // { text: 'Format', bold: true },
          ],

          ...table.map((user, i) => {
            return [i + 1, user.username, user.ste.name, user.ste.nif, user.lastname, user.email, user.phoneP + "/" + user.phoneS];
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

  static depotTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: [15, "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],

        body: [
          [
            { text: "#", bold: true },
            { text: "ref", bold: true },
            { text: "designation", bold: true },
            { text: "stock total", bold: true },
            { text: "cpa", bold: true },
            { text: "hedzranawoe", bold: true },
            { text: "rex", bold: true },
            { text: "quarantaine", bold: true },
            { text: "arrivage", bold: true },
            { text: "ablogame", bold: true },
            // { text: 'Format', bold: true },
          ],

          ...table.map((depot, i) => {
            return [
              i + 1,
              depot.ref,
              depot.designation,
              depot.qtities,
              depot.soms[0].qtities,
              depot.soms[1].qtities,
              depot.soms[2].qtities,
              depot.soms[3].qtities,
              depot.soms[4].qtities,
              depot.soms[5].qtities,
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

  static depotTableByDepot(table: any[]) {
    const depotName = table[0].soms[0].name;
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "*", "auto", "auto"],

        body: [
          [
            { text: "#", bold: true },
            { text: "ref", bold: true },
            { text: "designation", bold: true },
            { text: "stock total", bold: true },
            { text: depotName, bold: true },

            // { text: 'Format', bold: true },
          ],

          ...table.map((depot, i) => {
            return [i + 1, depot.ref, depot.designation, depot.qtities, depot.soms[0].qtities];
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

  static qtityFreeTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: [/* 20, */ "auto", "auto", "star", 25, 35, 25, 30],
        heights: [6],

        body: [
          [
            // { text: '#', bold: true },
            { text: "DATE", bold: true },
            { text: "COMMMANDE", bold: true },
            { text: "CLIENT", bold: true },
            { text: "Q.V", bold: true },
            { text: "UG(S)", bold: true },
            { text: "F.A", bold: true },
            { text: "T.UG", bold: true },
            // { text: 'Format', bold: true },
          ],

          ...table.map((ug, i) => {
            if (ug.date !== "") {
              return [
                // (i + 1),
                { text: ug.date, style: "rowText" },
                { text: ug.commande, style: "rowText" },
                { text: ug.client, style: "rowText" },
                { text: ug.qtityDlvr, style: "rowText" },
                { text: ug.qtityFree, style: "rowText" },
                { text: ug.approachCost, style: "rowText" },
                { text: ug.dueUg, style: "rowText" },
              ];
            } else {
              return [
                // (i + 1),
                { text: ug.commande, colSpan: 3, bold: true },
                // {},
                {},
                {},
                { text: ug.qtityDlvr, bold: true, alignment: "right" },
                { text: ug.qtityFree, bold: true, alignment: "right" },
                { text: ug.approachCost, bold: true, alignment: "right" },
                { text: ug.dueUg, bold: true, alignment: "right" },
              ];
            }
          }),
        ],
      },
      layout: {
        // fillColor: function (rowIndex) {
        fillColor: (rowIndex: number) => {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }
}

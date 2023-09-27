import { currencyFormatter } from "asv-hlps";
import dayjs from "dayjs";

import { HlpEntry } from "../../core/comptas/helpers/hlpEntry";

export class PdfComptaTables {
  static balanceTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", 25, "*", 60, 60, 60],
        heights: [6],

        body: [
          [
            { text: "#", bold: true },
            { text: "cpt", bold: true },
            { text: "Designation", bold: true },
            { text: "Debit", bold: true, alignment: "center" },
            { text: "Credit", bold: true, alignment: "center" },
            { text: "Solde", bold: true, alignment: "center" },
          ],

          ...table.map((sp, i) => {
            const debit = +sp.amountDebit ? currencyFormatter(+sp.amountDebit) : "";
            const credit = +sp.amountCredit ? currencyFormatter(+sp.amountCredit) : "";
            // const solde = currencyFormatter(+sp.amount);
            const solde = HlpEntry.amountSold(sp);
            const compte = sp.accountDebit || sp.accountCredit;
            return [
              i + 1,
              // sp.designation,

              { text: compte /* bold: true, */ },
              { text: sp.designation },
              { text: debit, /* bold: true, */ alignment: "right" },
              { text: credit, /* bold: true, */ alignment: "right" },
              { text: solde, /* bold: true, */ alignment: "right" },
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

  static dailyTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", 70, 100, "*", 60, 60],
        heights: [6],

        body: [
          [
            { text: "#", bold: true },
            { text: "Date", bold: true },
            { text: "Référence", bold: true },
            { text: "N°piece", bold: true, alignment: "center" },
            { text: "Debit", bold: true, alignment: "center" },
            { text: "Credit", bold: true, alignment: "center" },
          ],

          ...table.map((sp, i) => {
            const debit = HlpEntry.totalAmountDebit(sp.lines) ? currencyFormatter(HlpEntry.totalAmountDebit(sp.lines)) : "";
            const credit = HlpEntry.totalAmountCredit(sp.lines) ? currencyFormatter(HlpEntry.totalAmountCredit(sp.lines)) : "";
            const proof = HlpEntry.getProof(sp);
            return [
              i + 1,
              // sp.designation,

              { text: dayjs(sp.createdAt).format("DD/MM/YYYY") /* bold: true, */ },
              { text: sp.ref },
              { text: proof, /* bold: true, */ alignment: "left" },
              { text: debit, /* bold: true, */ alignment: "right" },
              { text: credit, /* bold: true, */ alignment: "right" },
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

  static bigBookTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", 25, 55, "*", 60, 60, 60, 90, 80],
        heights: [6],

        body: [
          [
            { text: "#", bold: true },
            { text: "Cpt", bold: true },
            { text: "Date", bold: true },
            { text: "Designation", bold: true },
            { text: "Debit", bold: true, alignment: "center" },
            { text: "Credit", bold: true, alignment: "center" },
            { text: "Solde", bold: true, alignment: "center" },
            { text: "Ref", bold: true, alignment: "center" },
            { text: "Pièce", bold: true, alignment: "center" },
          ],

          ...table.map((sp, i) => {
            const createdAt = dayjs(sp.createdAt).format("DD/MM/YY");
            const debit = +sp.amountDebit ? currencyFormatter(+sp.amountDebit) : "";
            const credit = +sp.amountCredit ? currencyFormatter(+sp.amountCredit) : "";
            // const solde = currencyFormatter((+sp.amountDebit || 0) + (+sp.amountCredit || 0));
            const solde = HlpEntry.amountSold(sp);
            // const solde = (+debit || 0) + (+credit || 0);
            // const compte = (sp.accountDebit) ? sp.accountDebit : sp.accountCredit;
            const entryRef = sp?.entry?.ref ? sp?.entry?.ref : "";
            const compte = sp.account;
            return [
              i + 1,
              // sp.designation,

              { text: compte /* bold: true, */ },
              { text: createdAt /* bold: true, */ },
              { text: sp.designation },
              { text: debit, /* bold: true, */ alignment: "right" },
              { text: credit, /* bold: true, */ alignment: "right" },
              { text: solde, /* bold: true, */ alignment: "right" },
              // { text: sp?.entry?.ref, alignment: "center" },
              { text: entryRef, alignment: "center" },
              { text: sp?.entry?.bill?.ref, alignment: "center" },
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

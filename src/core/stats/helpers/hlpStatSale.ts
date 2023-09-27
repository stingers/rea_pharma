import { currencyFormatterCfa, dateFormatter, getColorAccordingToDate, User } from "asv-hlps";

import { StatSaleProduct } from "../interfaces/StatSaleProduct";
import { CpaDefinition } from "../../../pdfs/CpaDefinition";
import { PdfTables } from "../../../pdfs/PdfTables";
import pdfService from "../../../services/pdfService";

class HlpStatSale {
  getTotalAmount = (tobs) => {
    return (tobs || []).reduce((prev, curr) => {
      return prev + (+curr.stat.saledAmount || 0);
    }, 0);
  };

  getTotalQtitySaled = (tobs) => {
    return (tobs || []).reduce((prev, curr) => {
      return prev + (+curr.stat.qtityDlvr || 0);
    }, 0);
  };

  getTotalQtityFree = (tobs) => {
    return (tobs || []).reduce((prev, curr) => {
      return prev + (+curr.stat.qtityFree || 0);
    }, 0);
  };

  getColor = (tob: { ins: string | any[] }) => {
    if (tob.ins.length) {
      return getColorAccordingToDate(tob.ins[0].expirationDate, 12, 24, 36);
    }
  };
  totalQtityDlvr = (tobs: any[]) => {
    if (!tobs) {
      return 0;
    }
    return tobs.reduce((prev, curr: StatSaleProduct) => prev + +curr.sumQtityDlvr, 0);
  };

  totalQtityOdr = (tobs: any[]) => {
    if (!tobs) {
      return 0;
    }
    return tobs.reduce((prev, curr: StatSaleProduct) => prev + +curr.sumQtityOdr, 0);
  };

  totalQtityFree = (tobs: any[]) => {
    if (!tobs) {
      return 0;
    }
    return tobs.reduce((prev, curr: StatSaleProduct) => prev + +curr.sumQtityFree, 0);
  };

  totalAmountQtityOdr = (tobs: any[]) => {
    if (!tobs) {
      return 0;
    }
    return tobs.reduce((prev, curr: StatSaleProduct) => prev + +curr.sumAmountQtityOdr, 0);
  };

  totalAmountQtityDlvr = (tobs: any[]) => {
    if (!tobs) {
      return 0;
    }
    const amount = tobs.reduce((prev, curr: StatSaleProduct) => prev + +curr.sumAmountQtityDlvr, 0);
    return currencyFormatterCfa(amount);
  };

  totalAmountQtityDlvrView = (tobs: any[]) => {
    if (!tobs) {
      return 0;
    }
    return tobs.reduce((prev, curr: StatSaleProduct) => prev + +curr.sumAmountQtityDlvr, 0);
  };
  genListUgPdf = (action: string, tobs: any[], user: User, dates: any) => {
    let listUgs = [];

    for (const tob of tobs) {
      // const ugs = [];
      listUgs.push({
        date: "",
        commande: tob.pdt.designation,
        client: "",
        qtityDlvr: tob.pdt.totalQtityDlvr,
        qtityFree: tob.pdt.totalQtityFree,
        approachCost: "20%",
        dueUg: Math.ceil(tob.pdt.totalQtityFree * 1.2),
      });
      for (const ug of tob.ugs) {
        listUgs.push({
          date: dateFormatter(ug.saleDate, "dmy", "/"),
          commande: ug.saleRef,
          client: ug.steName,
          qtityDlvr: ug.qtityDlvr,
          qtityFree: ug.qtityFree,
          approachCost: "20%",
          dueUg: Math.ceil(ug.qtityFree * 1.2),
        });
      }
      // listUgs.push(ugs);
    }

    const ugsText: string[] = [
      `campagne agence ${user.ste.name}`,
      `détails des ug distribuées du ${dateFormatter(dates.fromDate, "dmy", "/")} au  ${dateFormatter(dates.toDate, "dmy", "/")}`,
    ];

    pdfService.generatePdf(action, CpaDefinition.genericUgs(ugsText, PdfTables.qtityFreeTable(listUgs)));
  };
}
export default new HlpStatSale() as HlpStatSale;

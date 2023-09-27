import { Entry, EntryLine } from "asv-hlps";

export class HlpEntry {
  static sortAccount(tobs: EntryLine[], accountDirection: boolean) {
    accountDirection = !accountDirection;
    return tobs.sort((a, b) => {
      const keyA = +a.accountCredit || +a.accountDebit;
      const keyB = +b.accountCredit || +b.accountDebit;
      return this.sortAccount ? keyB - keyA : keyA - keyB;
    });
  }

  static amountSold(tob: any) {
    return (+tob?.amountDebit || 0) - (+tob?.amountCredit || 0);
  }

  static amountSoldDebit(tob: any) {
    if (+this.amountSold(tob) >= 0) {
      // console.log(this.amountSold(tob));
      return +this.amountSold(tob);
    }
    return "";
    // return this.amountSold(tob) >= 0 ? this.amountSold(tob): '' ;
  }

  static amountSoldCredit(tob: any) {
    if (+this.amountSold(tob) < 0) {
      return Math.abs(+this.amountSold(tob));
    }
    return "";
    // return this.amountSold(tob) < 0 ? Math.abs(this.amountSold(tob)): '' ;
  }

  static totalAmountSold(lines: EntryLine[]) {
    return lines.reduce((prev, curr: EntryLine) => {
      return +prev + (+curr?.amountDebit || 0) - (+curr?.amountCredit || 0);
    }, 0);
  }

  static totalAmountCreditOnListEntry(entries: Entry[]) {
    // return HlpEntry.entriesTotalAmountCredit(this.filteredTobs)
    return entries.reduce((prev, curr: Entry) => {
      return prev + this.totalAmountCredit(curr.lines);
    }, 0);
  }

  static totalAmountDebitOnListEntry(entries: Entry[]) {
    // return HlpEntry.entriesTotalAmountCredit(this.filteredTobs)
    return entries.reduce((prev, curr: Entry) => {
      return prev + this.totalAmountDebit(curr.lines);
    }, 0);
  }

  static totalAmountCreditOnListLines(lines: EntryLine[]) {
    // return HlpEntry.entriesTotalAmountCredit(this.filteredTobs)
    return lines.reduce((prev, curr: EntryLine) => {
      return prev + +curr.amountCredit;
    }, 0);
  }

  static totalAmountDebitOnListLines(lines: EntryLine[]) {
    // return HlpEntry.entriesTotalAmountCredit(this.filteredTobs)
    return lines.reduce((prev, curr: EntryLine) => {
      return prev + +curr.amountDebit;
    }, 0);
  }

  static totalAmountSoldCredit(lines: EntryLine[]) {
    const sold = this.totalAmountSold(lines);
    if (sold < 0) {
      return Math.abs(sold) || 0;
    }
    return 0;
    // return this.amountSold(tob) < 0 ? Math.abs(this.amountSold(tob)): '' ;
  }

  static totalAmountSoldDebit(lines: EntryLine[]) {
    const sold = this.totalAmountSold(lines);
    if (sold >= 0) {
      // console.log(this.amountSold(tob));
      return sold || 0;
    }
    return 0;
    // return this.amountSold(tob) >= 0 ? this.amountSold(tob): '' ;
  }

  static entriesTotalAmountCredit(entries: Entry[]) {
    entries.map((entry) => {
      return this.totalAmountCredit(entry.lines);
    });
  }

  static entriesTotalAmountSold(entries: Entry[]) {
    entries.map((entry) => {
      return this.totalAmountSold(entry.lines);
    });
  }

  static entriesTotalAmountDedit(entries: Entry[]) {
    entries.map((entry) => {
      return this.totalAmountDebit(entry.lines);
    });
  }

  static getProof(entry: Entry, proofId?: boolean) {
    if (entry.spent) {
      if (proofId) {
        return entry.spent.id;
      }
      return entry.spent.ref;
    }
    if (entry.bill) {
      if (proofId) {
        return entry.bill.id;
      }
      return entry.bill.ref;
    }
    return entry.proof;
  }

  static totalAmountCredit(lines: EntryLine[]) {
    return lines.reduce((prev, curr: EntryLine) => {
      return Math.floor(prev + (+curr.amountCredit || 0));
    }, 0);
  }

  static totalAmountDebit(lines: EntryLine[]) {
    return lines.reduce((prev, curr: EntryLine) => {
      return Math.floor(prev + (+curr.amountDebit || 0));
    }, 0);
  }

  static entryTotalAmount(lines: EntryLine[], option: "debit" | "credit") {
    switch (option) {
      case "debit":
        return this.totalAmountDebit(lines);
      case "credit":
        return this.totalAmountCredit(lines);
    }
    // return null;
  }

  static diffEntryTotalAmount(lines: EntryLine[]) {
    return this.totalAmountDebit(lines) !== this.totalAmountCredit(lines);
  }

  // static;

  /* static formatBalanceDatas(datas: any[]) {


    const result: any[] = [];

    datas.forEach((obj) => {
    // datas.map((obj) => {
      // const id = obj.designation.trim();
      const id = obj.accountDebit;
      // console.log(obj);
      if (!this[id]) {
        // console.log('cacacaca');


        result.push(this[id] = obj);
        // console.log(result);
      } else {

        this[id].amountDebit += +obj.amountDebit;
        this[id].amountCredit += +obj.amountCredit;
        // console.log(obj);
      }
    }, Object.create(null));
    // });
    return result;

  } */
}

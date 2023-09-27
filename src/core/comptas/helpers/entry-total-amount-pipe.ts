import { EntryLine, HlpEntry } from "asv-hlps";

class EntryTotalAmountPipe {
  transform(lines: EntryLine[], option: "debit" | "credit") {
    switch (option) {
      case "debit":
        return HlpEntry.totalAmountDebit(lines);
      case "credit":
        return HlpEntry.totalAmountCredit(lines);
    }
    // return null;
  }
}

export default new EntryTotalAmountPipe() as EntryTotalAmountPipe;

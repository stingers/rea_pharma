import { BillPayment, Feed, Spent } from "asv-hlps";

export class HlpCash {
  static getTotalSpents(tobs: Spent[]) {
    return tobs?.reduce((prev, curr) => {
      return +prev + +curr.amount;
    }, 0);
  }

  static getTotalFeeds(tobs: Feed[]) {
    return tobs?.reduce((prev, curr) => {
      return +prev + +curr.amount;
    }, 0);
  }

  static getTotalIncomes(tobs: BillPayment[]) {
    return tobs?.reduce((prev, curr) => {
      return +prev + +curr.paidAmount;
    }, 0);
  }

  static getTotalIncomesCashs(tobs: BillPayment[]) {
    return tobs
      ?.filter((x) => x.method.id === 1)
      .reduce((prev, curr) => {
        return +prev + +curr.paidAmount;
      }, 0);
  }

  static getTotalCashs(incomes: BillPayment[], feeds: Feed[]) {
    return this.getTotalIncomesCashs(incomes) + this.getTotalFeeds(feeds);
  }

  static getBilan(incomes: BillPayment[], feeds: Feed[], spents: Spent[]) {
    return this.getTotalIncomesCashs(incomes) + this.getTotalFeeds(feeds) - this.getTotalSpents(spents);
  }

  static getTotalIncomesChecks(tobs: BillPayment[]) {
    return tobs
      ?.filter((x) => x.method.id === 2)
      .reduce((prev, curr) => {
        return +prev + +curr.paidAmount;
      }, 0);
  }

  static getTotalIncomesVirements(tobs: BillPayment[]) {
    return tobs
      .filter((x) => x.method.id === 3)
      .reduce((prev, curr) => {
        return +prev + +curr.paidAmount;
      }, 0);
  }
}

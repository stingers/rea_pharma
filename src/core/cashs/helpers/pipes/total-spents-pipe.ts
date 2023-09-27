import { Spent } from "asv-hlps";
import { HlpCash } from "../hlpCash";

class TotalSpentsPipe {
  trans(tobs: Spent[]): number {
    return HlpCash.getTotalSpents(tobs);
  }
}
export default new TotalSpentsPipe();

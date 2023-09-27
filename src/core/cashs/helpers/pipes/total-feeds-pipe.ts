import { Feed } from "asv-hlps";
import { HlpCash } from "../hlpCash";

export class TotalFeedsPipe {
  transform(tobs: Feed[]): number {
    return HlpCash.getTotalFeeds(tobs);
  }
}

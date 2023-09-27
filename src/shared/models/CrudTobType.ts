import { HeaderTableColumnType } from "asv-hlps";

export interface CrudTobType {
  colPatial?: HeaderTableColumnType[];
  url: string;
  type?: any;
  // modalContent?: () => void;
  modalContent?;
  onSubmitForm?;
  searchQuery?: string;
}

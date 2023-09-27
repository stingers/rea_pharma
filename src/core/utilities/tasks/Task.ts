import { User } from "asv-hlps";

export interface Task {
  id?: number;
  title: string;
  endDate: string | Date;
  assignTo: User;
  done: boolean;
}

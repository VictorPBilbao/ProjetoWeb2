import { Budget } from "./budget.model";
import { Equipment } from "./equipment.model";
import { TaskTime } from "./task-time.model";
import { User } from "./user.model";

export interface Task {
  id?: string;
  assignee?: string;
  creator?: User | string;
  budget?: Budget;
  equipment?: string | Equipment;
  status?: string;
  summary?: string;
  title?: string;
  type?: string;
  time?: TaskTime;
}

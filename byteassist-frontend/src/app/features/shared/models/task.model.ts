import { Budget } from "./budget.model";
import { Equipment } from "./equipment.model";
import { TaskTime } from "./task-time.model";

export interface Task {
  id?: string;
  assignee?: string;
  creator?: string;
  budget?: string | Budget;
  equipment?: string | Equipment;
  status?: string;
  summary?: string;
  title?: string;
  type?: string;
  time?: TaskTime;
}

import { Equipment } from "./equipment.model";

export interface Budget {
  id: string;
  amount: number;
  description: string;
  equipment: string | Equipment;
}

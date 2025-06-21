import { User } from "./user.model";

export interface Budget {
  id?: string;
  accepted?: string;
  amount?: number;
  creator?: User;
  description?: string;
}

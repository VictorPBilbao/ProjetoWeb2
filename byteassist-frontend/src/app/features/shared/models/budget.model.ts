import { User } from "./user.model";

export interface Budget {
  id?: string;
  accepted?: boolean;
  amount?: number;
  creator?: User;
  description?: string;
}

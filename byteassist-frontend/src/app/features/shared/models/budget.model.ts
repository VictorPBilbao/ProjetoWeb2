import { User } from "./user.model";

export interface Budget {
  id?: string;
  accepted?: boolean;
  amount?: number;
  creator?: string | User;
  description?: string;
}

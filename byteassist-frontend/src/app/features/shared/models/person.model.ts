import { PersonAddress } from "./person-address.model";
import { PersonName } from "./person-name.model";

export interface Person {
  id: string;
  cpf: string;
  dob: Date;
  gender: string;
  address: PersonAddress;
  name: PersonName;
}

export interface PersonAddress {
  zip: string;
  number: string;
  street: string;
  neighborhood: string;
  complement?: string; // Optional field
  city: string;
  state: string;
  country: string;
}

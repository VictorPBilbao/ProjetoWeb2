import { Person } from "./person.model";
import { UserTime } from "./user-time.model";

export interface User {
    id: string;
    email: string;
    username: string;
    isActive: boolean;
    password?: string;
    person: string | Person;
    role: string;
    time: UserTime;
}

import { UserRole } from "./userRole";

export default interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    score: number;
}
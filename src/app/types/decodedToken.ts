import { UserRole } from "./userRole";

export default interface DecodedToken {
    username: string;
    role: UserRole;
}
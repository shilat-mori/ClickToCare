import { UserRole } from "./users/userRole";

export default interface DecodedToken {
    username: string;
    role: UserRole;
}
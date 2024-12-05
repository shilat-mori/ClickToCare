import { UserRole } from "./userRole";

export default interface DecodedToken {
    id: string;
    role: UserRole;
}
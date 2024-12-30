import IUser from "./users";

export interface UserScoreCardProps extends IUser {
    isMax: boolean;
}
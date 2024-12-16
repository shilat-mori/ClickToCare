import IUser from "./users";

//this data is only used for new users, until there are validated by admin
export default interface INewUser {
    _id: string;
    userInfo: IUser
    aboutMe: string;
    signTime: Date;
}
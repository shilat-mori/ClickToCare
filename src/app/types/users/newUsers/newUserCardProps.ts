import INewUser from "./newUser";

export default interface NewUserCardProps {
    userInfo: INewUser;
    setVerified: (userId: string) => void;
}
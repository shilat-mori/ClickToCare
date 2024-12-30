import INewUser from "./newUser";

export default interface NewUserCardProps {
    userInfo: INewUser;
    setVerified: (taskId: string) => void;
}
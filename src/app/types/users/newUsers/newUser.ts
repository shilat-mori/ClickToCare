export default interface INewUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  faceImage: ArrayBuffer | null;
  freeText: string;
  signTime: Date;
  reject_time: Date | null;
}

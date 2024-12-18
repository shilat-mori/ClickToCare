export default interface INewUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  faceImage: File | null;
  freeText: string;
  signTime: Date;
}

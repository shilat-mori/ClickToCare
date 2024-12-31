export default interface INewUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  faceImage: string; //URL from cloudinary
  freeText: string;
  signTime: Date;
  reject_time: Date | null;
}

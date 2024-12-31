import mongoose, { Model, Schema } from 'mongoose';
import INewUser from '@/app/types/users/newUsers/newUser';

const NewUserSchema: Schema<INewUser> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    faceImage: { type: String, required: true },
    freeText: { type: String, default: "" },
    signTime: { type: Date, default: Date.now },
});

const NewUser: Model<INewUser> = mongoose.models.NewUser || mongoose.model<INewUser>('NewUser', NewUserSchema);
export default NewUser;

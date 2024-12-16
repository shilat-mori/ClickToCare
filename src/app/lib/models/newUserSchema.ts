import mongoose, { Model, Schema } from 'mongoose';
import INewUser from '@/app/types/newUser'; //the interfave for new user
import User from './userSchema'; //for the user info

const NewUserSchema: Schema<INewUser> = new Schema({
    userInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    aboutMe: { type: String, required: true },
    signTime: { type: Date, default: Date.now },
});

const NewUser: Model<INewUser> = mongoose.models.NewUser || mongoose.model<INewUser>('NewUser', NewUserSchema);
export default NewUser;

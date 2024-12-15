import mongoose, {Model, Schema} from 'mongoose';
import IUser from '@/app/types/users';
import { UserRole } from '@/app/types/userRole';

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: Number, enum: UserRole, default: UserRole.unauthorized },
  score: {type: Number, default: 0},
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;

import mongoose, {Model, Schema} from 'mongoose';
import ITask from '@/app/types/tasks';

const TaskSchema: Schema<ITask> = new Schema({
    name: { type: String, required: true },
    description: { type: String},
    category: { type: String, required: true },
    points: { type: Number, required: true },
    assigned: { type: [String], default: [] },
    creation_time: { type: Date, default: Date.now },
    end_time: { type: Date, required: true }
});

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
export default Task;

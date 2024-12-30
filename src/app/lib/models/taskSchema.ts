import mongoose, {Model, Schema} from 'mongoose';
import ITask from '@/app/types/tasks/tasks';
import AssigneeSchema from './assigneeSchema';

const TaskSchema: Schema<ITask> = new Schema({
    name: { type: String, required: true },
    description: { type: String},
    category: { type: String, required: true },
    points: { type: Number, required: true },
    assigned_max: {type: Number, required: true, default: 1},
    assigned: { type: [AssigneeSchema], default: [] },
    creation_time: { type: Date, default: Date.now },
    end_time: { type: Date, required: true }
});

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
export default Task;

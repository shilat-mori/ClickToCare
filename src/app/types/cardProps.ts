import ITask from '../types/tasks'
import { Assignee } from './assignee';

export default interface CardProps {
    taskInfo: ITask;
    setAssigned: (taskId: string, updatedAssigned: Assignee[]) => void;
    onDelete: (taskId: string) => void;
}
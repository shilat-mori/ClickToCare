import ITask from './tasks'
import { Assignee } from './assignee/assignee';

export default interface CardProps {
    taskInfo: ITask;
    setAssigned: (taskId: string, updatedAssigned: Assignee[]) => void;
    onDelete: (taskId: string) => void;
}
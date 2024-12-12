import ITask from '../types/tasks'

export default interface CardProps {
    taskInfo: ITask;
    setAssigned: (taskId: string, updatedAssigned: string[]) => void;
}
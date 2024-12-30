import { Assignee } from "./assignee/assignee";

export default interface ITask {
    _id: string;
    name: string;
    description: string;
    category: string;
    points: number;
    assigned_max: number;
    assigned: Assignee[];
    creation_time: Date;
    end_time: Date;
}
export default interface ITask {
    _id: string;
    name: string;
    description: string;
    category: string;
    points: number;
    assigned: string[];
    creation_time: Date;
    end_time: Date;
}
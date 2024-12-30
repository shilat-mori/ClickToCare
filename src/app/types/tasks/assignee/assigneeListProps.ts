import { Assignee } from "./tasks/assignee";

export default interface AssigneeListProps {
    assigned: Assignee[];
    maxAssignees: number;
}
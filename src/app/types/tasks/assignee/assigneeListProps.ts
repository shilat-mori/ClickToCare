import { Assignee } from "./assignee";

export default interface AssigneeListProps {
    assigned: Assignee[];
    maxAssignees: number;
}
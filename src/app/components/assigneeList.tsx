import React from 'react';
import AssigneeListProps from '../types/assigneeListProps';

const AssigneeList: React.FC<AssigneeListProps> = ({ assigned, maxAssignees }) => {
    const emptySlots = maxAssignees - assigned.length;

    return (
        <div>
            <p>Available: {emptySlots}/{maxAssignees}</p>
            <table className="table-auto border-collapse border border-gray-500 w-full">
                <tbody>
                    {assigned.map((assignee, index) => (
                        <tr key={index} className="border border-gray-500">
                            <td className="p-2">{assignee.name}</td>
                        </tr>
                    ))}
                    {Array.from({ length: emptySlots }, (_, index) => (
                        <tr key={`empty-${index}`} className="border border-gray-500">
                            <td className="p-2 text-gray-400">—</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssigneeList;

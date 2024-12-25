import React from 'react';
import AssigneeListProps from '../types/assigneeListProps';

const AssigneeList: React.FC<AssigneeListProps> = ({ assigned, maxAssignees }) => {
    const emptySlots = maxAssignees - assigned.length;

    return (
        <div>
            <p>Available: {emptySlots}/{maxAssignees}</p>
            <table className="bordered table-auto w-full">
                <tbody>
                    {assigned.map((assignee, index) => (
                        <tr key={index} className="bordered">
                            <td className="p-2">{assignee.name}</td>
                        </tr>
                    ))}
                    {Array.from({ length: emptySlots }, (_, index) => (
                        <tr key={`empty-${index}`} className="bordered">
                            <td className="p-2 text-gray-400">—</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssigneeList;

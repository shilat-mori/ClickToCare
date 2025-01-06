"use client";
import React, { useEffect, useState } from "react";
import { getUserRoleFromCookies } from "@/app/services/frontUtils";
import { UserRole } from "@/app/types/users/userRole";
import TimeRemainingCard from "./timeRemaining/TimeRemainingCard";
import { removeMe, addMe, assignedToMe } from "@/app/services/changeAssigned"
import AssigneeList from "./assigneeList";
import { deleteTask } from "@/app/services/adminTaskDelete";
import Image from "next/image";
import CardProps from "@/app/types/tasks/cardProps";
import { useRouter } from "next/navigation";

//function to determine card color based on category
const categoryColor = (category: string) => {

  switch (category) {
    case "driving":
      return { base: "bg-lime-200", tag: "bg-lime-400" };
    case "phone_calls":
      return { base: "bg-fuchsia-200", tag: "bg-fuchsia-500" };
    case "physical_work":
      return { base: "bg-orange-200", tag: "bg-orange-500" };
    case "visits":
      return { base: "bg-teal-200", tag: "bg-teal-500" };
    case "other":
      return { base: "bg-indigo-200", tag: "bg-indigo-500" };
    default:
      return { base: "bg-gray-200", tag: "bg-gray-400" };
  }
};

const TaskCard: React.FC<CardProps> = ({ taskInfo, setAssigned, onDelete }) => {
  //set card colors according to category
  const { base, tag } = categoryColor(taskInfo.category);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAssigned, setIsAssigned] = useState<boolean | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await getUserRoleFromCookies();
      setRole(userRole);
    };

    fetchRole();

    const checkAssignment = async () => {
      const assigned = await assignedToMe(taskInfo._id);
      setIsAssigned(assigned);
    };

    checkAssignment();
  }, [taskInfo._id]);

  const handleAssign = async () => {
    //check if there are no empty places:
    if (taskInfo.assigned.length >= taskInfo.assigned_max) return;

    const newAssign = await addMe(taskInfo._id); // Add user to task
    if (newAssign) {
      setAssigned(taskInfo._id, newAssign);
    }
    setIsAssigned(true); // Update state to reflect assignment
  };

  const handleRemove = async () => {
    const newAssign = await removeMe(taskInfo._id); // Remove user from task
    if (newAssign) {
      setAssigned(taskInfo._id, newAssign);
    }
    setIsAssigned(false); // Update state to reflect unassignment
  };

  const handleDelete = async () => {
    const success = await deleteTask(taskInfo._id);
    if (success) {
      onDelete(taskInfo._id);
    }
  };

  const handleEdit = () => {
    router.push(`/pages/protected/admin/Task/${taskInfo._id}`)
  };

  const renderActionButtons = () => {
    if (!role) {
      return <div>Loading...</div>;
    }
    if (role === UserRole.admin) {
      return (
        <div>
          <button
            onClick={handleEdit}
            className={`action_button bg-orange-300`}
          >
            Edit
          </button>
          <button onClick={handleDelete} className={`action_button bg-red-400`}>
            Delete
          </button>
        </div>
      );
    }
    if (role === UserRole.authorized) {
      if (isAssigned === null) {
        return <div>Loading...</div>;
      }
      if (isAssigned) {
        return (
          <button onClick={handleRemove} className={`action_button bg-red-400`}>
            Remove me
          </button>
        );
      } else {
        if (taskInfo.assigned.length >= taskInfo.assigned_max)
          return (
            <div className="text-center bg-white bg-opacity-40 rounded-md">
              Full
            </div>
          );
        return (
          <button onClick={handleAssign} className={`action_button bg-sky-400`}>
            Add Me!
          </button>
        );
      }
    }
    return <div>No actions available</div>;
  };

  return (
    <div className={`relative shadow-lg shadow-slate-300 p-4 pt-10 ${base}`}>
      {/* Category Tag */}
      <span
        className={`absolute top-2 right-2 px-3 py-1 text-sm font-semibold border rounded-full ${tag}`}
      >
        {taskInfo.category.replace("_", " ").toUpperCase()}
      </span>
      <h2 className="text-xl font-bold">{taskInfo.name}</h2>
      <p className="border border-gray-500 p-2 m-2 rounded-xl">
        {taskInfo.description}
      </p>
      <p className="flex justify-center items-center">
        {taskInfo.points} X{" "}
        <Image
          src="/images/points_logo.png"
          alt="points icon"
          width={80}
          height={80}
        />
      </p>
      <AssigneeList
        assigned={taskInfo.assigned}
        maxAssignees={taskInfo.assigned_max}
      />
      <TimeRemainingCard
        startTime={new Date(taskInfo.creation_time)}
        endTime={new Date(taskInfo.end_time)}
      />
      <div className="w-full border-t-2 border-gray-500 border-dashed pt-2">
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default TaskCard;

"use client";

import TaskForm from "@/app/components/tasks/TaskForm";
import ITask from "@/app/types/tasks/tasks";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const [taskToUpdate, setTaskToUpdate] = useState<ITask | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getTask = async (taskId: string | string[]) => {
      try {
        const res = await axios.get<ITask>(`/api/tasks/${taskId}`);
        console.log("Response: ", res.data);
        setTaskToUpdate(res.data); // update state
      } catch (error) {
        console.error("Error fetching task: ", error);
      }
    };

    if (id) {
      getTask(id);
    }
  }, [id]);

  const goBack = () => {
    router.push("/pages/protected/publicTasks");
  };

  return (
    <TaskForm mode="update" taskToUpdate={taskToUpdate} />
  );
};

export default Page;

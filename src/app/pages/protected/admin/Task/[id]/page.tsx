"use client";

import TaskForm from "@/app/components/TaskForm";
import { TaskFormPageProps } from "@/app/types/TaskFormPageProps";
import ITask from "@/app/types/tasks";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page: React.FC<TaskFormPageProps> = ({ turn_back }) => {
  const { id } = useParams(); // מקבל את ה־id מהנתיב
  const [taskToUpdate, setTaskToUpdate] = useState<ITask | null>(null);
  const router = useRouter()
  useEffect(() => {
    const getTask = async (taskId: string | string[]) => {
      try {
        const res = await axios.get<ITask>(`/api/tasks/${taskId}`);
        console.log("Response: ", res.data);
        setTaskToUpdate(res.data); // עדכון המצב עם הנתונים שהתקבלו
      } catch (error) {
        console.error("Error fetching task: ", error);
      }
    };

    if (id) {
      getTask(id); // קריאה לפונקציה רק אם id קיים
    }


  }, [id]);

  const goBack = () => {
    router.push("/pages/protected/publicTasks");
  };

  console.log({turn_back});

  return (
    <TaskForm turn_back={goBack} mode="update" taskToUpdate={taskToUpdate} />
  );
};

export default Page;

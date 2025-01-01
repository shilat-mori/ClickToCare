"use client";
import React, { useState, useEffect } from "react";
import ITask from "@/app/types/tasks/tasks";
import axios, { AxiosError } from "axios";

interface ITaskForm {
  mode: "add" | "update";
  taskToUpdate: ITask | null;
}

const TaskForm: React.FC<ITaskForm> = ({ mode, taskToUpdate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [points, setPoints] = useState<number>(0);
  const [assigned_max, setAssigned_max] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [endByDate, setEndByDate] = useState<boolean>(true);
  const [duration, setDuration] = useState<string>("00:00:00");

  useEffect(() => {
    console.log(taskToUpdate);

    if (taskToUpdate) {
      setName(taskToUpdate.name);
      setDescription(taskToUpdate.description);
      setCategory(taskToUpdate.category);
      setPoints(taskToUpdate.points);
      setAssigned_max(taskToUpdate.assigned_max);
      setStartTime(new Date(taskToUpdate.creation_time))
      // console.log(new Date(taskToUpdate.end_time).getTime());

      setEndTime(new Date(taskToUpdate.end_time));
    }
  }, [taskToUpdate]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(event.target.value);
  };

  const calcEndTime = (duration: string) => {
    const [days, hours, minutes] = duration
      .split(":")
      .map((num) => parseInt(num, 10));
    const durationInMillis =
      days * 24 * 60 * 60 * 1000 + // Convert days to milliseconds
      hours * 60 * 60 * 1000 + // Convert hours to milliseconds
      minutes * 60 * 1000; // Convert minutes to milliseconds
    return new Date(startTime.getTime() + durationInMillis);
  };

  const validateDurationInput = (input: string) => {
    // Regex for matching the format DD:HH:MM where hours can be any number and minutes range from 00 to 59
    const regex = /^([0-9]{1,2}):([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return regex.test(input);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newDuration = e.target.value.replace(/[^0-9]/g, ""); //leave only the numbers
    const length = newDuration.length;
    if (length > 2 && length <= 4) {
      newDuration = newDuration.replace(/(\d{2})(\d{1,2})$/, "$1:$2"); // Add colon after hours
    }
    if (length > 4 && length <= 6) {
      newDuration = newDuration.replace(/(\d{2})(\d{2})(\d{1,2})$/, "$1:$2:$3"); // Add colon after minutes
    }
    // Ensure the string doesn't exceed 6 characters (max allowed: "DD:HH:MM")
    if (length > 6) {
      newDuration = newDuration
        .substring(0, 6)
        .replace(/(\d{2})(\d{2})(\d{1,2})$/, "$1:$2:$3");
    }

    setDuration(newDuration);
    if (validateDurationInput(newDuration)) {
      const calculatedEndTime = calcEndTime(newDuration);
      setEndTime(calculatedEndTime);
      console.log("end: ",endTime, "calculated: ",calculatedEndTime);
      
    }
  };

  const validate = () => {
    if (!name.trim()) {
      console.error("Task name is required");
      return false;
    }
    if (!category) {
      console.error("Please select a category.");
      return false;
    }
    if (points <= 0 || points > 5) {
      console.error("Points must be between 0.5 and 5.");
      return false;
    }
    if (assigned_max < 1) {
      console.error("At lease one assignee per task");
    }
    if (!endTime || endTime <= startTime) {
      console.error("End time must be after the start time.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const task: ITask = {
      _id: "",
      name,
      description,
      category,
      points,
      assigned_max,
      assigned: [],
      creation_time: startTime,
      end_time: endTime!,
    };
    console.log(task);
    
    switch (mode) {
      case "add": {
        try {
          const response = await axios.post("/api/tasks", task);
          console.log("Task successfully submitted:", response.data.name);
        } catch (error) {
          console.error("Error submitting a new Task: ", error);
        }
      }
      case "update": {
        if (!taskToUpdate) {
          console.error("Error with task to update ");
          return;
        }

        task._id = taskToUpdate._id;
        task.assigned = taskToUpdate.assigned.slice(0, assigned_max - 1);
        task.creation_time = taskToUpdate.creation_time;

        console.log("updated task: ", task);

        try {
          const response = await axios.put(
            `/api/tasks/${taskToUpdate._id}`,
            task
          );
          console.log("Task successfully submitted:", response.data.task);
        } catch (error) {
          if(error instanceof AxiosError)
            console.error("Error submitting a new Task: ", error.response!.data.error)
          else console.error("Error submitting a new Task: ", error);
          return
        }
      }
    }
  };

  const isValidDate = (date: any): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  const renderEndDate = () => {
    return endByDate ? (
      <div className="form-box">
        <input
          type="date"
          name="endTime"
          value={isValidDate(endTime) ? endTime!.toISOString().split("T")[0] : ""}
          onChange={(e) =>{
             setEndTime(new Date(e.target.value))
            console.log(endTime);
            
            }}
          className="form-input"
        />
        <button className="btn bg-gray-400" onClick={() => setEndByDate(false)}>
          By End Date
        </button>
      </div>
    ) : (
      <div className="form-box">
        <input
          type="text"
          name="endTime"
          value={duration}
          onChange={handleDurationChange}
          className="form-input"
        />
        <button className="btn bg-gray-400" onClick={() => setEndByDate(true)}>
          By Time Limit
        </button>
      </div>
    );
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="box">
        <h1>New Task:</h1>
        <input
          type="text"
          name="name"
          placeholder="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
        />
        <select
          name="category"
          value={category}
          onChange={handleCategoryChange}
          className="form-input"
        >
          <option value="" disabled>
            Category
          </option>
          <option value="driving">Driving</option>
          <option value="phone_calls">Phone Calls</option>
          <option value="physical_work">Physical Work</option>
          <option value="visits">Visits</option>
          <option value="other">other</option>
        </select>
        <label>
          Task Value in Points:
          <input
            type="number"
            name="points"
            value={points}
            onChange={(e) => setPoints(parseFloat(e.target.value) || 0)}
            className="form-input"
            step={0.5}
            min={0}
            max={5}
          />
        </label>
        <label>
          Number of assignees:
          <input
            type="number"
            name="assigned_max"
            value={assigned_max}
            onChange={(e) => setAssigned_max(parseFloat(e.target.value) || 0)}
            className="form-input"
            min={0}
          />
        </label>
        {renderEndDate()}
        <button type="submit" className="blue-button">
          {mode === "add" ? "Add Task" : "Update Task Details"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;

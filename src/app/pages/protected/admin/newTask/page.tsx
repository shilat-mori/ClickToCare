"use client"
import React, { useState } from 'react'
import ITask from '@/app/types/tasks';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const NewTask = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [points, setPoints] = useState<number>(0);
    const [startTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [endByDate, setEndByDate] = useState<boolean>(true);
    const [duration, setDuration] = useState<string>("00:00:00");

    const inpStyle = "m-2 border-gray-300 border-2 rounded";
    const buttonStyle = "m-2 py-1 px-3 bg-purple-600 text-white rounded";

    const goBack = () => {
        router.push('/pages/protected/publicTasks');
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
    };

    const calcEndTime = (duration: string) => {
        const [days, hours, minutes] = duration.split(':').map((num) => parseInt(num, 10));
        const durationInMillis =
            (days * 24 * 60 * 60 * 1000) + // Convert days to milliseconds
            (hours * 60 * 60 * 1000) + // Convert hours to milliseconds
            (minutes * 60 * 1000); // Convert minutes to milliseconds
        return new Date(startTime.getTime() + durationInMillis);
    }

    const validateDurationInput = (input: string) => {
        // Regex for matching the format DD:HH:MM where hours can be any number and minutes range from 00 to 59
        const regex = /^([0-9]{1,2}):([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
        return regex.test(input);
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newDuration = e.target.value.replace(/[^0-9]/g, ''); //leave only the numbers
        const length = newDuration.length;
        if (length > 2 && length <= 4) {
            newDuration = newDuration.replace(/(\d{2})(\d{1,2})$/, '$1:$2');  // Add colon after hours
        }
        if (length > 4 && length <= 6) {
            newDuration = newDuration.replace(/(\d{2})(\d{2})(\d{1,2})$/, '$1:$2:$3');  // Add colon after minutes
        }
        // Ensure the string doesn't exceed 6 characters (max allowed: "DD:HH:MM")
        if (length > 6) {
            newDuration = newDuration.substring(0, 6).replace(/(\d{2})(\d{2})(\d{1,2})$/, '$1:$2:$3');
        }

        setDuration(newDuration);
        if (validateDurationInput(newDuration)) {
            const calculatedEndTime = calcEndTime(newDuration);
            setEndTime(calculatedEndTime);
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
        if (!endTime || endTime <= startTime) {
            console.error("End time must be after the start time.");
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate())
            return;
        const task: ITask = {
            _id: "",
            name,
            description,
            category,
            points,
            assigned: [],
            creation_time: startTime,
            end_time: endTime!,
        };
        try {
            const response = await axios.post('/api/tasks', task);
            console.log("Task successfully submitted:", response.data.name);
            goBack();
        } catch (error) {
            console.error("Error submitting a new Task: ", error);
        }
    }

    const renderEndDate = () => {
        if (endByDate) {
            return (
                <div>
                    <input
                        type="date"
                        name="endTime"
                        value={endTime ? endTime.toISOString().split('T')[0] : ''}
                        onChange={(e) => setEndTime(new Date(e.target.value))}
                        className={inpStyle}
                    />
                    <button onClick={() => setEndByDate(false)}>By End Date</button>
                </div>
            );
        } else {
            return (
                <div>
                    <input
                        type="text"
                        name="endTime"
                        value={duration}
                        onChange={handleDurationChange}
                        className={inpStyle}
                    />
                    <button onClick={() => setEndByDate(true)}>By Time Limit</button>
                </div>
            );
        }
    }
    return (
        <div>
            <button className={buttonStyle} onClick={goBack}>
                Back
            </button>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <h1>New Task:</h1>
                <input
                    type="text"
                    name="name"
                    placeholder="Task name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inpStyle}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={inpStyle}
                />
                <select
                    name="category"
                    value={category}
                    onChange={handleCategoryChange}
                    className={inpStyle}
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
                        className={inpStyle}
                        step={0.5}
                        min={0}
                        max={5}
                    />
                </label>
                {renderEndDate()}
                <button type="submit" className={buttonStyle}>
                    Add Task
                </button>
            </form>
        </div>
    )
}

export default NewTask
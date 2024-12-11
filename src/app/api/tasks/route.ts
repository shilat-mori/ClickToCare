import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Task from "@/app/lib/models/taskSchema";

//post - new task
export async function POST(req: NextRequest) {
    try {
        //connect to mongoDB (the database)
        await connect();
        //get the user data
        const { name, description, category, points, assigned, creation_time, end_time } = await req.json();
        if (!name || !description || !category || points <= 0 || !end_time) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const newTask = new Task({
            name,
            description,
            category,
            points,
            assigned,
            creation_time: new Date(creation_time),
            end_time: new Date(end_time),
        });
        await newTask.save();
        return NextResponse.json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error("Error posting a task: ", error);
        return NextResponse.json({ error: "Error posting a new task" }, { status: 500 });
    }
};
//get - show tasks
export async function GET(req: NextRequest) {
    try {
        await connect();
        // Extract query params
        const category = req.nextUrl.searchParams.get('category') || '';
        const sortBy = req.nextUrl.searchParams.get('sortBy');
        const order: 'asc' | 'desc' = req.nextUrl.searchParams.get('order') === 'desc' ? 'desc' : 'asc';

        // Create filter
        const filter = category ? { category } : {};
        // Define sorting priority
        const sortCriteria: { [key: string]: 'asc' | 'desc' } = {};
        if (sortBy) {
            sortCriteria[sortBy] = order; // Custom sort
        } else {
            sortCriteria['creation_time'] = 'asc'; // Default to oldest creation time
        }

        // Fetch and sort tasks
        const tasks = await Task.find(filter).sort(sortCriteria);
        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 });
    }
};
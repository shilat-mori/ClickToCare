import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Task from "@/app/lib/models/taskSchema";

// GET - Get task by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Connect to MongoDB
        await connect();

        // Find the task by ID
        const task = await Task.findById(params.id);
        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("Error fetching task by ID: ", error);
        return NextResponse.json({ error: "Error fetching task by ID" }, { status: 500 });
    }
}

// PUT - Update task by ID (manage assigned field)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connect();

        // Get the new data from the request body
        const { assigned } = await req.json();

        // Find and update the task by ID
        const updatedTask = await Task.findByIdAndUpdate(
            params.id,
            { assigned },
            { new: true } // Return the updated document
        );

        if (!updatedTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.error("Error updating task by ID: ", error);
        return NextResponse.json({ error: "Error updating task" }, { status: 500 });
    }
}

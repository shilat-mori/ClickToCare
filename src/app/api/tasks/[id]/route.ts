import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import Task from "@/app/lib/models/taskSchema";
import ITask from "@/app/types/tasks/tasks";

// GET - Get task by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to MongoDB
    await connect();

    // Find the task by ID
    const task: ITask | null = await Task.findById(params.id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task by ID: ", error);
    return NextResponse.json(
      { error: "Error fetching task by ID" },
      { status: 500 }
    );
  }
}

// PUT - Update task by ID (manage assigned field)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    // Get the new data from the request body
    const {
      name,
      description,
      category,
      points,
      assigned_max,
      assigned,
      creation_time,
      end_time,
    } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json(
        { error: "Invalid description content" },
        { status: 400 }
      );
    }

    if (!
      ["driving", "phone_calls", "physical_work", "visits", "other"].includes(
        category
      )
    ) {
      return NextResponse.json({ error: `Invalid category ${category}` }, { status: 400 });
    }

    if (!points || Number.parseFloat(points) <= 0) {
      return NextResponse.json(
        { error: "Invalid task score" },
        { status: 400 }
      );
    }

    if (!assigned_max || Number.parseInt(assigned_max) <= 0) {
      return NextResponse.json(
        { error: "Invalid assigned volunteers count" },
        { status: 400 }
      );
    }

    if (
      !creation_time ||
      new Date(creation_time).getTime() > new Date().getTime()
    ) {
      return NextResponse.json(
        { error: "Invalid creation time" },
        { status: 400 }
      );
    }

    if (!end_time || new Date(end_time).getTime() <= new Date().getTime()) {
      return NextResponse.json({ error: "Invalid end time" }, { status: 400 });
    }

    // Find and update the task by ID
    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      {
        name,
        description,
        category,
        points,
        assigned_max,
        assigned,
        creation_time,
        end_time,
      },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task by ID: ", error);
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}

// DELETE - Delete task by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    // Find and delete the task by ID
    const deletedTask = await Task.findByIdAndDelete(params.id);

    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task by ID: ", error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import NewUser from "@/app/lib/models/newUserSchema";

// Get a specific user by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connect();
        const newUser = await NewUser.findById(params.id);

        if (!newUser) {
            return NextResponse.json({ error: "New user not found" }, { status: 404 });
        }

        return NextResponse.json(newUser);
    } catch (error) {
        return NextResponse.json({ error: "Error in fetching new user " + error }, { status: 500 });
    }
}

// Delete a specific user by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connect();
        const deletedUser = await NewUser.findByIdAndDelete(params.id);

        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        return NextResponse.json({ error: "Error in deleting user " + error }, { status: 500 });
    }
}

// update the newUser as rejected
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connect();
        const newUser = await NewUser.findById(params.id);

        if (!newUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // add now in utc as reject time
        newUser.reject_time = new Date();

        await newUser.save();
        return NextResponse.json({ message: "User updated successfully", newUser });
    } catch (error) {
        return NextResponse.json({ error: "Error in updating user " + error });
    }
}


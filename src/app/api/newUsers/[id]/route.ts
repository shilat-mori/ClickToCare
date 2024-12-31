import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import NewUser from "@/app/lib/models/newUserSchema";
import cloudinary from "@/app/services/cloudinary";

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

        const userToDelete = await NewUser.findById(params.id);
        if (!userToDelete) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        // Get the Cloudinary public_id from the user's face image URL
        const public_id = userToDelete.faceImage.split("/").pop()?.split(".")[0];
        // Delete the image from Cloudinary
        if (public_id) {
            const result = await cloudinary.uploader.destroy(public_id);
            if (result.result !== "ok") {
                return NextResponse.json(
                    { error: "Failed to delete image from Cloudinary" },
                    { status: 500 }
                );
            }
        }

        const deletedUser = await NewUser.findByIdAndDelete(params.id);

        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        return NextResponse.json({ error: "Error in deleting user " + error }, { status: 500 });
    }
}


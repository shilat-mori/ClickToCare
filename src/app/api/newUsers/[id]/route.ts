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

async function removeImage(faceImage: string) {
    console.log("faceImage: ", faceImage);
    // Get the Cloudinary public_id from the user's face image URL
    const urlParts = faceImage.split("/");
    const public_id = urlParts.slice(-2).join("/").split(".")[0]; // Handle nested folders

    if (!public_id) throw new Error("Failed to extract public ID");

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "not found") {
        console.warn("Image not found in Cloudinary");
    } else if (result.result !== "ok") {
        throw new Error("Failed to delete image from Cloudinary");
    }
};

// Delete a specific user by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connect();

        const userToDelete = await NewUser.findById(params.id);
        if (!userToDelete) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        try {
            if (userToDelete.faceImage)
                await removeImage(userToDelete.faceImage);
        } catch (imageError) {
            if (imageError instanceof Error) {
                console.error("Image deletion error:", imageError.message);
                return NextResponse.json({ error: imageError.message }, { status: 500 });
            } else {
                console.error("Unknown error during image deletion:", imageError);
                return NextResponse.json({ error: "Unknown error during image deletion" }, { status: 500 });
            }
        }

        const deletedUser = await NewUser.findByIdAndDelete(params.id);
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


import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/userSchema";
import { generateToken } from "../../lib/tokenUtil";
import { UserRole } from "@/app/types/userRole";
import bcrypt from 'bcryptjs';
import { SortOrder } from "mongoose";

//add a new user - when admin verifies the new user to regular user
export async function POST(req: NextRequest) {
    try {
        //connect to mongoDB (the database)
        await connect();
        //get the user data
        const user = await req.json();
        //create the new user and save to database
        const newUser = new User({
            username: user.username,
            email: user.email,
            password: user.password,
            role: UserRole.authorized,
            score: 0
        }); //about me, face image and signUp time aren't needed
        await newUser.save();
        return NextResponse.json({ message: "User added successfully", user: newUser });
    } catch (error) {
        return NextResponse.json({ error: "Error in adding user " + error });
    }
};

//sort - for score board 
export async function GET(req: NextRequest) {
    try {
        await connect();
        // Extract query params
        const role = req.nextUrl.searchParams.get('role') || '';
        const filter = role ? { role } : {};
        const sortCriteria: { score: SortOrder } = { score: 'desc' };

        const users = await User.find(filter).sort(sortCriteria);
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Error in fetching users " + error });
    }
};

//update the user score (if we want to reduce it, addition will be a negative number)
export async function PUT(req: NextRequest) {
    try {
        await connect();
        const { username, addition, role } = await req.json();

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (role === UserRole.authorized) {
            // Update the score
            user.score += addition;
        }

        await user.save();
        return NextResponse.json({ message: "User updated successfully", user });
    } catch (error) {
        return NextResponse.json({ error: "Error in updating user " + error });
    }
};
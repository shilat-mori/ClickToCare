import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/userSchema";
import { generateToken } from "../../lib/tokenUtil";
import { UserRole } from "@/app/types/userRole";
import bcrypt from 'bcryptjs';
import { SortOrder } from "mongoose";

//add a new user - signUp
export async function POST(req: NextRequest) {
    try {
        //connect to mongoDB (the database)
        await connect();
        //get the user data
        const { username, password, email } = await req.json();
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        //create the new user and save to database
        const newUser = new User({ username, password: hashedPassword, email, role: UserRole.unauthorized, score: 0 });
        await newUser.save();
        //generate a token - unauthorized, since we just signed up
        const token = await generateToken(newUser.username, UserRole.unauthorized);
        // Set the token in a cookie
        const response = NextResponse.json({ message: "User created successfully", user: newUser });
        response.cookies.set("token", token, {
            httpOnly: false, //for debugging, later change to true
            sameSite: 'lax', // Allows cookies on same-site navigation - also for debugging
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60, // 1 hour
        });

        return response;
    } catch (error) {
        return NextResponse.json("Error in creating user " + error);
    }
};

//get all users - used to verify login, and for the admin to get all unathorized users
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
        const { username, addition } = await req.json();

        console.log(`PUT on api/users/ - username: ${username}, addition: ${addition}`);

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update the score
        user.score += addition;
        await user.save();
        return NextResponse.json({ message: "User score updated successfully", user });
    } catch (error) {
        return NextResponse.json({ error: "Error in updating user score " + error });
    }
};
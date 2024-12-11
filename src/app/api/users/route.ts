import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/userSchema";
import { generateToken } from "../../lib/tokenUtil";
import { UserRole } from "@/app/types/userRole";
import bcrypt from 'bcryptjs';

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
        const newUser = new User({ username, password: hashedPassword, email, role: UserRole.unauthorized });
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
export async function GET() {
    try {
        await connect();
        const users = await User.find();
        return NextResponse.json({ message: "Fetched users successfully", data: users });
    } catch (error) {
        return NextResponse.json("Error in fetching users " + error);
    }
};
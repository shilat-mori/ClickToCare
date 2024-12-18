import connect from "@/app/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import User from "@/app/lib/models/userSchema";
import NewUser from "@/app/lib/models/newUserSchema";
import { UserRole } from "@/app/types/userRole";
import { generateToken } from "@/app/lib/tokenUtil";
import { SortOrder } from "mongoose";

//post new req - from sign up
export async function POST(req: NextRequest) {
    try {
        //connect to mongoDB (the database)
        await connect();
        //get the user data
        const { data } = await req.json();

        // Check if the email already exists
        // on regular users
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }
        //on new users
        const existingNewUser = await NewUser.findOne({ email: data.email });
        if (existingNewUser) {
            return NextResponse.json({ error: "Email already exists, wait to be approved" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        //create the new user and save to database
        const newUser = new NewUser({
            username: data.username,
            email: data.email,
            password: hashedPassword,
            // faceImage: data.faceImage[0]
            faceImage: null,
            freeText: data.freeText,
            signTime: new Date(),
        });
        await newUser.save();
        //generate a token - unauthorized, since we just signed up
        const token = await generateToken(newUser.username, UserRole.unauthorized);
        // Set the token in a cookie
        const response = NextResponse.json({ message: "New user created successfully", user: newUser });
        response.cookies.set("token", token, {
            httpOnly: false, //for debugging, later change to true
            sameSite: 'lax', // Allows cookies on same-site navigation - also for debugging
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60, // 1 hour
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error in creating new user' }, { status: 500 });
    }
};

//get all - for adim/ see all new users
export async function GET(req: NextRequest) {
    try {
        await connect();
        // Extract query params
        const sortCriteria: { signTime: SortOrder } = { signTime: 'asc' }; //show oldest req first

        const users = await NewUser.find().sort(sortCriteria);
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Error in fetching new users " + error });
    }
};
import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/userSchema";
import { generateToken } from "../../lib/tokenUtil";
import bcrypt from 'bcryptjs';
import NewUser from "@/app/lib/models/newUserSchema";
import { UserRole } from "@/app/types/userRole";

//check the user with DB - logIn
export async function POST(req: NextRequest) {
    //connect to mongoDB (the database)
    await connect();
    const requ = await req
    console.log("request: ", requ);

    const { username, password } = await req.json();
    console.log("request json: ", username, password);
    try {
        // Check if user exists
        const user = await User.findOne({ username });
        const newUser = await NewUser.findOne({ username });
        console.log(user);
        console.log(newUser);

        if (!user && !newUser) {
            return NextResponse.json({ error: 'Username does not exist' }, { status: 401 });
        }
        const currentUser = (user) ? user : newUser;

        // Compare password with hashed password
        let isMatch = await bcrypt.compare(password, currentUser!.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
        }

        // Generate a JWT token with user role
        const token = await generateToken(currentUser!.username, ('role' in currentUser!) ? currentUser.role : UserRole.unauthorized);
        // Set the token in a cookie
        const response = NextResponse.json({ message: 'Login successful' });
        response.cookies.set('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',//sameSite: 'strict',
            maxAge: 60 * 60, // 1 hour
        });

        return response;

    } catch (error) {
        console.error('Login error', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
};

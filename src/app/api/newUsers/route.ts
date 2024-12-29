import connect from "@/app/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/lib/models/userSchema";
import NewUser from "@/app/lib/models/newUserSchema";
import { UserRole } from "@/app/types/userRole";
import { generateToken } from "@/app/lib/tokenUtil";
import { SortOrder } from "mongoose";
import { string } from "zod";

//post new req - from sign up
export async function POST(req: NextRequest) {
  try {
    //connect to mongoDB (the database)
    await connect();

    // get the data from the request body
    const formData = await req.formData(); // Use formData directly
    const file = formData.get("faceImage") as File; // Adjust the field name as necessary

    if (!file) {
      return NextResponse.json(
        { error: "No face image found in the request." },
        { status: 501 }
      );
    }

    // Process the file or other fields
    const fields = Object.fromEntries(formData.entries());

    console.log("Fields:", fields);
    console.log("Files:", file);

    // Convert file to Base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Check if the email already exists
    // on regular users
    const existingUser = await User.findOne({
      $or: [{ email: fields.email }, { username: fields.username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }
    //on new users
    const existingNewUser = await NewUser.findOne({
      $or: [{ email: fields.email }, { username: fields.username }],
    });
    if (existingNewUser) {
      return NextResponse.json(
        { error: "Email or username already exists, wait to be approved" },
        { status: 409 }
      );
    }
    console.log(fields.password);

    const hashedPassword = await bcrypt.hash(String(fields.password), 10);
    //create the new user and save to database
    const newUser = new NewUser({
      username: fields.username,
      email: fields.email,
      password: hashedPassword,
      faceImage: base64Image,
      freeText: fields.freeText,
      signTime: new Date().toISOString(), //save as ISO format in UTC
    });
    console.log(newUser);

    await newUser.save();
    //generate a token - unauthorized, since we just signed up
    const token = await generateToken(newUser.username, UserRole.unauthorized);
    // Set the token in a cookie
    const response = NextResponse.json({
      message: "New user created successfully",
      user: newUser,
    });
    response.cookies.set("token", token, {
      httpOnly: false, //for debugging, later change to true
      sameSite: "lax", // Allows cookies on same-site navigation - also for debugging
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    console.log();

    return NextResponse.json(
      { error: "Error in creating new user" },
      { status: 500 }
    );
  }
}

//get all - for admin/ see all new users
export async function GET(req: NextRequest) {
  console.log("api/newUsers - get");
  try {
    await connect();
    // Extract query params
    const username = req.nextUrl.searchParams.get("username");
    console.log("api/newUsers - get - username: ", username);
    //if search for a specific user
    if (username) {
      const user = await NewUser.find({ username });
      console.log("api/newUsers - get - user: ", user);
      return NextResponse.json(user || { error: "User not found" });
    }

    //otherwise, return all
    const sortCriteria: { signTime: SortOrder } = { signTime: "asc" }; //show oldest req first

    const users = await NewUser.find().sort(sortCriteria);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Error in fetching new users " + error });
  }
}

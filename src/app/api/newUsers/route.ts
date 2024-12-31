import connect from "@/app/lib/db/mongodb";
import cloudinary from "@/app/services/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/lib/models/userSchema";
import NewUser from "@/app/lib/models/newUserSchema";
import { UserRole } from "@/app/types/users/userRole";
import { generateToken } from "@/app/lib/tokenUtil";

//post new req - from sign up
export async function POST(req: NextRequest) {
  try {
    //connect to mongoDB (the database)
    await connect();

    // get the data from the request body
    const formData = await req.formData();
    const file = formData.get("faceImage") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No face image found in the request." },
        { status: 400 }
      );
    }

    // Process the file or other fields
    const fields = Object.fromEntries(formData.entries());

    // Check if email or username already exists in User or NewUser collections
    const emailOrUsernameExists = await User.findOne({
      $or: [{ email: fields.email }, { username: fields.username }],
    }) || await NewUser.findOne({
      $or: [{ email: fields.email }, { username: fields.username }],
    });

    if (emailOrUsernameExists) {
      return NextResponse.json(
        { error: "Email or username already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(String(fields.password), 10);

    // Convert the File to a Base64 Data URI
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64Image}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "users/faceImages",
      public_id: String(fields.username),
      overwrite: true,
    });

    if (!uploadResult || !uploadResult.secure_url) {
      return NextResponse.json(
        { error: "Failed to upload face image to Cloudinary." },
        { status: 500 }
      );
    }

    //create the new user and save to database
    const newUser = new NewUser({
      username: fields.username,
      email: fields.email,
      password: hashedPassword,
      faceImage: uploadResult.secure_url,
      freeText: fields.freeText,
      signTime: new Date().toISOString(), //save as ISO format in UTC
      reject_time: null,
    });

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
    return NextResponse.json(
      { error: "Error in creating new user" },
      { status: 500 }
    );
  }
}

//get all - for admin/ see all new users
export async function GET(req: NextRequest) {
  try {
    await connect();

    // Extract query params
    const username = req.nextUrl.searchParams.get("username");

    //if search for a specific user
    if (username) {
      const user = await NewUser.find({ username });
      return NextResponse.json(user || { error: "User not found" });
    }

    //otherwise, return all that are not rejected
    const users = await NewUser.find({ reject_time: null }).sort({ signTime: "asc" });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Error in fetching new users " + error });
  }
}

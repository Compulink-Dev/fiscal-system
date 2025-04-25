// app/api/auth/signup/route.ts
import { User } from "@/models/User";
import  Company  from "@/models/Company";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/database";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, email, password, companyId } = await request.json();

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json(
        { message: "Invalid company selected" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      company: companyId,
      role: "user",
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
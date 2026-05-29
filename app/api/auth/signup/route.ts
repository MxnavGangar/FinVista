import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "customer",
    });

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    );

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}

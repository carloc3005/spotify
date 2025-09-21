import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" }, 
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" }, 
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length < 1 || name.length > 50) {
      return NextResponse.json(
        { message: "Name must be between 1 and 50 characters" }, 
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" }, 
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with hashed password
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      }
    });

    return NextResponse.json({
      message: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    // More detailed error handling
    if (error instanceof Error) {
      // Check for common Prisma errors
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          { message: "User with this email already exists" }, 
          { status: 400 }
        );
      }
      
      console.error("Error details:", error.message);
      return NextResponse.json(
        { message: "Database error occurred. Please try again." }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." }, 
      { status: 500 }
    );
  }
}

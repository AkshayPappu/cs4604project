import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { email, password, first_name, last_name } = await request.json();

    // Validate input
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { message: "Email, password, first name, and last name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        first_name,
        last_name
      })
      .select()
      .single();

    if (userError) {
      console.error("User creation error:", userError);
      return NextResponse.json(
        { message: "Error creating user: " + userError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
} 
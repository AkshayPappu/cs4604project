import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key exists:", supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();
    console.log("Reset password request received for email:", email);

    // Validate input
    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email and new password are required" },
        { status: 400 }
      );
    }

    // Get user from Supabase
    console.log("Attempting to find user with email:", email);
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    console.log("Supabase response:", { user, error });

    if (error) {
      console.error("User lookup error:", error);
      return NextResponse.json(
        { message: "Error finding user", details: error.message },
        { status: 500 }
      );
    }

    if (!user) {
      console.log("No user found with email:", email);
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    console.log("User found:", { id: user.id, email: user.email });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", user.id);

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        { message: "Error updating password", details: updateError.message },
        { status: 500 }
      );
    }

    console.log("Password successfully updated for user:", user.id);
    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 
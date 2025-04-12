import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user from users table with all role IDs
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { message: "Error fetching user roles", error: userError.message },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Return only the role IDs
    const roleData = {
      student_id: user.student_id || null,
      officer_id: user.officer_id || null,
      organizer_id: user.organizer_id || null,
      admin_id: user.admin_id || null
    };

    return NextResponse.json(roleData);
  } catch (error) {
    console.error("Error in roles endpoint:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
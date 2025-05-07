import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { club_id } = await request.json();
    if (!club_id) {
      return NextResponse.json({ error: "Missing club_id" }, { status: 400 });
    }

    // Get the current user's student_id
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("student_id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user?.student_id) {
      return NextResponse.json({ error: "User is not a student or not found" }, { status: 403 });
    }

    // Insert new membership
    const { error: insertError } = await supabase
      .from("membership")
      .insert({
        membership_id: uuidv4(),
        club_id,
        student_id: user.student_id,
        membership_start_date: new Date().toISOString().split("T")[0],
        membership_status: "active"
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 
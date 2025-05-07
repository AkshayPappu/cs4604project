import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { event_id } = await request.json();
    if (!event_id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // Get the student_id from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("student_id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get current event_ids array
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("event_ids")
      .eq("student_id", user.student_id)
      .single();

    if (studentError) {
      return NextResponse.json({ error: studentError.message }, { status: 500 });
    }

    // Add new event_id to array if not already present
    const currentEventIds = student.event_ids || [];
    if (currentEventIds.includes(event_id)) {
      return NextResponse.json({ error: "Already registered for this event" }, { status: 400 });
    }

    const updatedEventIds = [...currentEventIds, event_id];

    // Update the student's event_ids
    const { error: updateError } = await supabase
      .from("students")
      .update({ event_ids: updatedEventIds })
      .eq("student_id", user.student_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 
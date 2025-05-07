import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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

    // Get the student's event_ids
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("event_ids")
      .eq("student_id", user.student_id)
      .single();

    if (studentError) {
      return NextResponse.json({ error: studentError.message }, { status: 500 });
    }

    const registeredEventIds = student.event_ids || [];
    if (registeredEventIds.length === 0) {
      return NextResponse.json([]);
    }

    // Get all registered events
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("event_id, event_name, event_date, event_location, club_id")
      .in("event_id", registeredEventIds);

    if (eventsError) {
      return NextResponse.json({ error: eventsError.message }, { status: 500 });
    }

    // Get club names for display
    const { data: clubs, error: clubsError } = await supabase
      .from("clubs")
      .select("club_id, club_name");

    if (clubsError) {
      return NextResponse.json({ error: clubsError.message }, { status: 500 });
    }

    const clubMap = Object.fromEntries(clubs.map((c: any) => [c.club_id, c.club_name]));
    const eventsWithClubName = (events || []).map((event: any) => ({
      ...event,
      club_name: clubMap[event.club_id] || "Unknown Club"
    }));

    return NextResponse.json(eventsWithClubName);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 
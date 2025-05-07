import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("Fetching events for user:", session.user.email);

    // First get the user to get their student_id
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("student_id")
      .eq("email", session.user.email)
      .single();
    
    if (userError || !user) {
      console.log("User error:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    console.log("Found user:", user);
    const student_id = user.student_id;

    // Then get the student's event_ids
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("event_ids")
      .eq("student_id", student_id)
      .single();

    if (studentError) {
      console.log("Student error:", studentError);
      return NextResponse.json({ error: studentError.message }, { status: 500 });
    }

    const registeredEventIds = student?.event_ids || [];

    // Get all club_ids for this student
    const { data: memberships, error: membershipError } = await supabase
      .from("membership")
      .select("club_id")
      .eq("student_id", student_id);
    
    if (membershipError) {
      console.log("Membership error:", membershipError);
      return NextResponse.json({ error: membershipError.message }, { status: 500 });
    }
    
    console.log("Found memberships:", memberships);
    const clubIds = memberships.map((m: any) => m.club_id);
    
    if (clubIds.length === 0) {
      console.log("No club memberships found");
      return NextResponse.json([]);
    }

    // Get all events in those clubs
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("event_id, event_name, event_date, event_location, club_id")
      .in("club_id", clubIds);
    
    if (eventsError) {
      console.log("Events error:", eventsError);
      return NextResponse.json({ error: eventsError.message }, { status: 500 });
    }
    
    console.log("Found events:", events);

    // Filter out registered events in JavaScript instead of SQL
    const availableEvents = (events || []).filter(
      (event) => !registeredEventIds.includes(event.event_id)
    );

    // Get club names for display
    const { data: clubs, error: clubsError } = await supabase
      .from("clubs")
      .select("club_id, club_name");
    
    if (clubsError) {
      console.log("Clubs error:", clubsError);
      return NextResponse.json({ error: clubsError.message }, { status: 500 });
    }
    
    console.log("Found clubs:", clubs);
    
    const clubMap = Object.fromEntries(clubs.map((c: any) => [c.club_id, c.club_name]));
    const eventsWithClubName = availableEvents.map((event: any) => ({
      ...event,
      club_name: clubMap[event.club_id] || "Unknown Club"
    }));

    console.log("Final events with club names:", eventsWithClubName);
    return NextResponse.json(eventsWithClubName);
  } catch (err: any) {
    console.log("Unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 
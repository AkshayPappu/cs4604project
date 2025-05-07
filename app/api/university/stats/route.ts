import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Get total students
    const { count: studentCount } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true });

    // Get total clubs
    const { count: clubCount } = await supabase
      .from("clubs")
      .select("*", { count: "exact", head: true });

    // Get total upcoming events (event_date >= today)
    const today = new Date().toISOString().split("T")[0];
    const { count: eventCount } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("event_date", today);

    return NextResponse.json({
      total_students: studentCount ?? 0,
      total_clubs: clubCount ?? 0,
      total_upcoming_events: eventCount ?? 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
} 
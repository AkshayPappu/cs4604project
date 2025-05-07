import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request, context: any) {
  const { club_id } = context.params;
  if (!club_id) {
    return NextResponse.json({ error: "Missing club_id" }, { status: 400 });
  }

  // Get all events for this club
  const { data: events, error } = await supabase
    .from("events")
    .select("event_id, event_name, event_date, event_location")
    .eq("club_id", club_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(events || []);
} 
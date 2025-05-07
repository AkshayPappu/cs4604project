import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import type { NextRequest } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest, context: any) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { club_id } = context.params;
    const { event_name, date, location } = await request.json();

    // Get the current user's officer_id
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("officer_id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user?.officer_id) {
      return NextResponse.json({ error: "User is not a club officer or not found" }, { status: 403 });
    }

    if (!event_name || !date || !location || !club_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabase
      .from("events")
      .insert({
        event_id: uuidv4(),
        club_id,
        event_name,
        event_date: date,
        event_location: location,
        organizer_id: user.officer_id
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Catch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
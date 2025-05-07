import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { club_ids } = await request.json();
    if (!club_ids || !Array.isArray(club_ids) || club_ids.length === 0) {
      return NextResponse.json({ clubs: [] });
    }

    const { data, error } = await supabase
      .from("clubs")
      .select("club_id, club_name, club_description, club_budget")
      .in("club_id", club_ids);

    if (error) {
      return NextResponse.json({ clubs: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ clubs: data });
  } catch (error) {
    return NextResponse.json({ clubs: [], error: "Internal server error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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

    // Get all club_ids the student is a member of
    const { data: memberships, error: membershipError } = await supabase
      .from("membership")
      .select("club_id")
      .eq("student_id", user.student_id);

    if (membershipError) {
      return NextResponse.json({ error: membershipError.message }, { status: 500 });
    }

    const clubIds = memberships?.map(m => m.club_id) || [];
    if (clubIds.length === 0) {
      return NextResponse.json([]);
    }

    // Get all clubs with those club_ids
    const { data: clubs, error: clubsError } = await supabase
      .from("clubs")
      .select("club_id, club_name, club_description, club_budget")
      .in("club_id", clubIds);

    if (clubsError) {
      return NextResponse.json({ error: clubsError.message }, { status: 500 });
    }

    return NextResponse.json(clubs || []);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 
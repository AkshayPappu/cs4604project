import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    const { club_name, club_description, club_budget } = await request.json();

    if (!club_name || !club_description || !club_budget) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Get the current user from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("officer_id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user?.officer_id) {
      return NextResponse.json({ message: "User is not a club officer or not found." }, { status: 403 });
    }

    // Insert the new club and get its ID
    const { data: clubData, error: clubError } = await supabase
      .from("clubs")
      .insert({
        club_name,
        club_description,
        club_budget: Number(club_budget)
      })
      .select("club_id")
      .single();

    if (clubError || !clubData?.club_id) {
      return NextResponse.json({ message: "Error creating club.", details: clubError?.message }, { status: 500 });
    }

    // Fetch the officer's current club_ids array
    const { data: officer, error: officerError } = await supabase
      .from("club_officers")
      .select("club_ids")
      .eq("officer_id", user.officer_id)
      .single();

    if (officerError || !officer) {
      return NextResponse.json({ message: "Officer not found.", details: officerError?.message }, { status: 404 });
    }

    // Append the new club_id to the array
    const updatedClubIds = officer.club_ids ? [...officer.club_ids, clubData.club_id] : [clubData.club_id];

    // Update the officer's club_ids array
    const { error: updateError } = await supabase
      .from("club_officers")
      .update({ club_ids: updatedClubIds })
      .eq("officer_id", user.officer_id);

    if (updateError) {
      return NextResponse.json({ message: "Error updating officer's club_ids.", details: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Club created successfully." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
} 
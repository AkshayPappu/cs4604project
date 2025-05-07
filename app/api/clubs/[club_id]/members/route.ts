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

  // Get all memberships for this club
  const { data: memberships, error: membershipError } = await supabase
    .from("membership")
    .select("student_id")
    .eq("club_id", club_id);

  if (membershipError) {
    return NextResponse.json({ error: membershipError.message }, { status: 500 });
  }

  if (!memberships || memberships.length === 0) {
    return NextResponse.json([]);
  }

  // Get student names
  const studentIds = memberships.map((m: any) => m.student_id);
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("student_id, first_name, last_name")
    .in("student_id", studentIds);

  if (studentsError) {
    return NextResponse.json({ error: studentsError.message }, { status: 500 });
  }

  // Combine first and last name
  const members = (students || []).map((s: any) => ({
    student_id: s.student_id,
    name: `${s.first_name} ${s.last_name}`.trim()
  }));

  return NextResponse.json(members);
} 
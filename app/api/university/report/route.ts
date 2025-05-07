import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Fetch all students and their memberships
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("student_id, first_name, last_name");
    if (studentsError) throw studentsError;

    const { data: memberships, error: membershipsError } = await supabase
      .from("membership")
      .select("student_id, club_id");
    if (membershipsError) throw membershipsError;

    const { data: clubs, error: clubsError } = await supabase
      .from("clubs")
      .select("club_id, club_name");
    if (clubsError) throw clubsError;

    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("event_id, club_id");
    if (eventsError) throw eventsError;

    // Map for club names
    const clubMap = Object.fromEntries(clubs.map((c: any) => [c.club_id, c.club_name]));

    // Section 1: Students and their clubs
    const studentClubs = students.map((student: any) => {
      const clubIds = memberships.filter((m: any) => m.student_id === student.student_id).map((m: any) => m.club_id);
      const clubNames = clubIds.map((id: string) => clubMap[id]).filter(Boolean);
      return {
        name: `${student.first_name} ${student.last_name}`.trim(),
        clubs: clubNames
      };
    });

    // Section 2: Clubs and their stats
    const clubStats = clubs.map((club: any) => {
      const memberCount = memberships.filter((m: any) => m.club_id === club.club_id).length;
      const eventCount = events.filter((e: any) => e.club_id === club.club_id).length;
      return {
        name: club.club_name,
        memberCount,
        eventCount
      };
    });

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = 780;
    page.drawText("University Report", { x: 50, y, size: 24, font, color: rgb(0, 0, 0) });
    y -= 40;

    // Section 1
    page.drawText("Students and Their Clubs", { x: 50, y, size: 18, font });
    y -= 24;
    for (const student of studentClubs) {
      if (y < 60) { page = pdfDoc.addPage([600, 800]); y = 780; }
      page.drawText(student.name, { x: 50, y, size: 12, font });
      y -= 16;
      page.drawText(`Clubs: ${student.clubs.length > 0 ? student.clubs.join(", ") : "None"}`, { x: 70, y, size: 12, font });
      y -= 16;
    }
    y -= 24;

    // Section 2
    page.drawText("Clubs and Their Stats", { x: 50, y, size: 18, font });
    y -= 24;
    for (const club of clubStats) {
      if (y < 60) { page = pdfDoc.addPage([600, 800]); y = 780; }
      page.drawText(club.name, { x: 50, y, size: 12, font });
      y -= 16;
      page.drawText(`Members: ${club.memberCount} | Events: ${club.eventCount}`, { x: 70, y, size: 12, font });
      y -= 16;
    }

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="university-report.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
} 
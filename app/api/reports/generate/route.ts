import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    console.log("[API] /api/reports/generate endpoint hit");
    const session = await getServerSession();
    if (!session?.user?.email) {
      console.log("[API] Unauthorized: no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the club officer's clubs
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("officer_id")
      .eq("email", session.user.email)
      .single();

    if (userError || !userData?.officer_id) {
      console.log("[API] Club officer not found", userError);
      return NextResponse.json({ error: "Club officer not found" }, { status: 404 });
    }

    const { data: officerData, error: officerError } = await supabase
      .from("club_officers")
      .select("club_ids")
      .eq("officer_id", userData.officer_id)
      .single();

    if (officerError || !officerData?.club_ids) {
      console.log("[API] No clubs found", officerError);
      return NextResponse.json({ error: "No clubs found" }, { status: 404 });
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = 780;
    page.drawText("Club Activity Report", { x: 50, y, size: 24, font, color: rgb(0, 0, 0) });
    y -= 40;

    // For each club
    for (const clubId of officerData.club_ids) {
      // Get club details
      const { data: clubData, error: clubError } = await supabase
        .from("clubs")
        .select("club_name")
        .eq("club_id", clubId)
        .single();

      if (clubError) {
        console.log(`[API] Club not found for club_id ${clubId}`, clubError);
        continue;
      }

      // Add club section
      page.drawText(clubData.club_name, { x: 50, y, size: 18, font });
      y -= 24;

      // Get club members from membership table
      const { data: memberships, error: membershipsError } = await supabase
        .from("membership")
        .select("student_id")
        .eq("club_id", clubId);

      if (!membershipsError && memberships && memberships.length > 0) {
        // Get student details
        const studentIds = memberships.map((m: any) => m.student_id);
        const { data: students, error: studentsError } = await supabase
          .from("students")
          .select("first_name, last_name")
          .in("student_id", studentIds);

        page.drawText("Club Members", { x: 50, y, size: 14, font });
        y -= 16;
        page.drawText(`Total Members: ${students?.length ?? 0}`, { x: 50, y, size: 12, font });
        y -= 16;
        (students || []).forEach((student) => {
          page.drawText(`• ${student.first_name} ${student.last_name}`, { x: 50, y, size: 12, font });
          y -= 16;
        });
      } else if (membershipsError) {
        console.log(`[API] Error fetching members for club_id ${clubId}`, membershipsError);
      }

      // Get club events and attendees
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select(`
          event_id,
          event_name,
          event_date,
          event_location
        `)
        .eq("club_id", clubId);

      if (!eventsError && events) {
        page.drawText("Events", { x: 50, y, size: 14, font });
        y -= 16;
        for (const event of events) {
          page.drawText(event.event_name, { x: 50, y, size: 12, font });
          y -= 16;
          page.drawText(`Date: ${event.event_date}`, { x: 50, y, size: 12, font });
          y -= 16;
          page.drawText(`Location: ${event.event_location}`, { x: 50, y, size: 12, font });
          y -= 16;

          // Get event attendees
          const { data: attendees, error: attendeesError } = await supabase
            .from("students")
            .select("first_name, last_name")
            .contains("event_ids", [event.event_id]);

          if (!attendeesError && attendees) {
            page.drawText(`Total Attendees: ${attendees.length}`, { x: 50, y, size: 12, font });
            y -= 16;
            attendees.forEach((attendee) => {
              page.drawText(`• ${attendee.first_name} ${attendee.last_name}`, { x: 50, y, size: 12, font });
              y -= 16;
            });
          } else if (attendeesError) {
            console.log(`[API] Error fetching attendees for event_id ${event.event_id}`, attendeesError);
          }
          y -= 16;
        }
      } else if (eventsError) {
        console.log(`[API] Error fetching events for club_id ${clubId}`, eventsError);
      }

      y -= 40;
      pdfDoc.addPage();
    }

    // Finalize PDF
    const pdfBytes = await pdfDoc.save();

    // Return PDF
    console.log("[API] PDF generated and returned");
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="club-report.pdf"',
      },
    });
  } catch (error) {
    console.error("[API] Error generating report:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
} 
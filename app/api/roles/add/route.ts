import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { role, ...formData } = await request.json();
    const roleId = uuidv4();

    // Get user details from users table
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("first_name, last_name, email, student_id")
      .eq("email", session.user.email)
      .single();

    if (userDataError || !userData) {
      return NextResponse.json(
        { message: "Error fetching user data" },
        { status: 400 }
      );
    }

    // If adding a role that requires student role, check if user is already a student
    if (role === "club_officer") {
      if (!userData.student_id) {
        return NextResponse.json(
          { message: "You must be a student first before adding this role" },
          { status: 400 }
        );
      }
    }

    // Create role record based on role type
    let roleData;
    let tableName;
    
    switch (role) {
      case "student":
        tableName = "students";
        roleData = {
          student_id: roleId,
          major: formData.major || null,
          classification: formData.classification || null,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email
        };
        break;
      case "club_officer":
        tableName = "club_officers";
        roleData = {
          officer_id: roleId,
          position_title: formData.position_title,
          officer_start_date: formData.officer_start_date || null,
          officer_end_date: formData.officer_end_date || null,
          student_id: userData.student_id
        };
        break;
      case "event_organizer":
        tableName = "event_organizers";
        roleData = {
          organizer_id: roleId,
          organizer_name: formData.organizer_name || `${userData.first_name} ${userData.last_name}`,
          contact_email: formData.contact_email || userData.email,
          contact_phone: formData.contact_phone || null
        };
        break;
      case "university_admin":
        tableName = "university_admins";
        roleData = {
          admin_id: roleId,
          admin_name: formData.admin_name || `${userData.first_name} ${userData.last_name}`,
          admin_email: formData.admin_email || userData.email,
          admin_phone: formData.admin_phone || null
        };
        break;
      default:
        return NextResponse.json(
          { message: "Invalid role type" },
          { status: 400 }
        );
    }

    // Insert role record
    const { error: roleError } = await supabase
      .from(tableName)
      .insert(roleData);

    if (roleError) {
      console.error("Role creation error:", roleError);
      return NextResponse.json(
        { message: `Error creating role: ${roleError.message}` },
        { status: 400 }
      );
    }

    // Update user record with role ID
    const updateData = {
      [`${role === 'club_officer' ? 'officer' : role === 'university_admin' ? 'admin' : role === 'event_organizer' ? 'organizer' : role}_id`]: roleId
    };

    const { error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("email", session.user.email);

    if (updateError) {
      console.error("User update error:", updateError);
      // If user update fails, try to delete the role we just created
      await supabase.from(tableName).delete().eq(`${role}_id`, roleId);
      return NextResponse.json(
        { message: `Error updating user with role: ${updateError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Role added successfully", roleId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in roles/add endpoint:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 
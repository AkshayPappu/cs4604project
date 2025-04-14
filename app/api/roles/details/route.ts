import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, roleId } = await request.json();
    if (!role || !roleId) {
      return NextResponse.json({ error: 'Role and role ID are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get the user's current record
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let tableName: string;
    let idField: string;

    switch (role) {
      case 'student':
        tableName = 'students';
        idField = 'student_id';
        break;
      case 'club_officer':
        tableName = 'club_officers';
        idField = 'officer_id';
        break;
      case 'event_organizer':
        tableName = 'event_organizers';
        idField = 'organizer_id';
        break;
      case 'university_admin':
        tableName = 'university_admins';
        idField = 'admin_id';
        break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Fetch the role details
    const { data: roleDetails, error: detailsError } = await supabase
      .from(tableName)
      .select('*')
      .eq(idField, roleId)
      .single();

    if (detailsError) {
      return NextResponse.json({ error: 'Failed to fetch role details' }, { status: 500 });
    }

    return NextResponse.json({ details: roleDetails });
  } catch (error) {
    console.error('Error fetching role details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
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

    const supabase = createClient();

    // Get the user's current record
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete the role entity
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

    // Delete the role entity
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq(idField, roleId);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete role entity' }, { status: 500 });
    }

    // Update the user record to remove the role ID
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        [`${role === 'university_admin' ? 'admin' : 
            role === 'club_officer' ? 'officer' : 
            role === 'event_organizer' ? 'organizer' : 
            role}_id`]: null 
      })
      .eq('email', session.user.email);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update user record' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
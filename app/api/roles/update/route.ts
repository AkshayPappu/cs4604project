import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, formData } = await request.json();
    if (!role || !formData) {
      return NextResponse.json({ error: 'Role and form data are required' }, { status: 400 });
    }

    console.log('Update Role - Form Data:', formData);
    console.log('Update Role - Role:', role);

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
    let roleId: string;

    switch (role) {
      case 'student':
        tableName = 'students';
        idField = 'student_id';
        roleId = user.student_id;
        break;
      case 'club_officer':
        tableName = 'club_officers';
        idField = 'officer_id';
        roleId = user.officer_id;
        break;
      case 'event_organizer':
        tableName = 'event_organizers';
        idField = 'organizer_id';
        roleId = user.organizer_id;
        break;
      case 'university_admin':
        tableName = 'university_admins';
        idField = 'admin_id';
        roleId = user.admin_id;
        break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (!roleId) {
      return NextResponse.json({ error: 'User does not have this role' }, { status: 400 });
    }

    // Update the role details
    const updateData = {
      ...formData,
      // Handle null values for optional fields
      ...(role === 'club_officer' && {
        officer_start_date: formData.officer_start_date || null,
        officer_end_date: formData.officer_end_date || null
      }),
      ...(role === 'university_admin' && {
        admin_name: formData.admin_name === '' ? null : formData.admin_name,
        admin_email: formData.admin_email === '' ? null : formData.admin_email,
        admin_phone: formData.admin_phone === '' ? null : formData.admin_phone
      })
    };

    console.log('Update Role - Data to be updated:', updateData);

    const { error: updateError } = await supabase
      .from(tableName)
      .update(updateData)
      .eq(idField, roleId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update role details',
        details: updateError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ message: 'Role details updated successfully' });
  } catch (error) {
    console.error('Error updating role details:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
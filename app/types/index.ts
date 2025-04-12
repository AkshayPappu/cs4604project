export interface RoleDetails {
  student?: {
    major?: string;
    classification?: string;
  };
  club_officer?: {
    position_title?: string;
    officer_start_date?: string;
    officer_end_date?: string;
  };
  event_organizer?: {
    organizer_name?: string;
    contact_email?: string;
    contact_phone?: string;
  };
  university_admin?: {
    admin_name?: string;
    admin_email?: string;
    admin_phone?: string;
  };
}

export interface UserRoles {
  student_id?: string;
  officer_id?: string;
  organizer_id?: string;
  admin_id?: string;
} 
# Campus Club Event Management System

## User Support (15%)
- Support for multiple user types with secure authentication
- User data is stored in database tables with no hardcoded credentials
- Features: signup, login, logout, password change
- Admins can be manually created first and can then create other admins via the app
- Passwords are encrypted
- Additional tables may be added to meet schema needs

## System Functionality (50%)
- All application functionality must work through the interface (not directly on the DB)
- Features should support all types of end-users

## Reporting Facility (20%)
- Reports on specific database sections and overall system statistics
- Useful insights for both end-users and managers

## GUI (15%)
- Interface built for usability and non-technical users
- Table IDs replaced with human-friendly labels

---

## Phase 1: Project Proposal

**Proposed Project Description**  
The purpose of the Campus Club Event Management System is to enable students and faculty to efficiently plan campus-wide events. Some advantages of this system include detailed scheduling, student attendance tracking, and report generation for club officials and organizers. From a technical point of view, using a SQL database can help us easily organize and retrieve pertinent information for any type of user. Implementing optimized queries can help improve performance, making the system scalable for a growing number of users and organizations.

**Value Added Facilities**  
- Automated Event Reminders: Send email or push notifications for upcoming events  
- Member Performance Metrics: Generate insights on student engagement  
- Mobile Friendly Access: Students can RSVP and check event details via mobile devices  
- Club Financial Tracking: Maintain club budgets, dues, and event expenses  

**Application Personas**  
1. Club Officers - Manage club events, track attendance, and oversee membership detail  
2. Students - View and RSVP for club events, check attendance history, and track involvement  
3. University Admins - Monitor club activities, generate reports, and ensure compliance  
4. Event Organizers - Coordinate event logistics and track participant engagement  

**Functionalities per User**  
1. **Club Officers**  
   - Create, edit, and delete club events  
   - View and manage attendance records  
   - Track membership data and growth trends  
   - Generate reports on event participation  
   - Send notifications or emails to members  

2. **Students**  
   - Register for club events and RSVP  
   - View upcoming and past events  
   - Track personal attendance history  
   - Receive notifications about events  

3. **University Admins**  
   - Monitor club activities and events  
   - Generate compliance reports  
   - Oversee system integrity and security  

4. **Event Organizers**  
   - Manage event logistics  
   - Assign roles for event coordination  
   - Track real-time event participation  

**List of Real World Entities**  
1. Clubs  
2. Students  
3. Events  
4. Attendance Records  
5. Club Officers  
6. Membership Data  
7. University Admins  
8. Event Organizers  
9. Notifications  
10. Reports  

**Roles of Project Members**  
- Database Design & Implementation (Raj Kashikar)  
- Backend Development (Akshay Pappu)  
- Frontend and UI Development (Jeriah Valencia)  
- Testing and Documentation (Rami Ghaleb)  
- Security and Compliance (Ramswaroop Devakumar)  

**Conclusion**  
The Campus Club Event Management System is a scalable, user-friendly, database-driven solution to improve the efficiency of club management at universities. It streamlines event scheduling, attendance tracking, and enhances student engagement.

---

## Phase 2: ERD & Problem Definition

**Problem Definition**  
The Campus Club Event Management System enables students and faculty to efficiently plan campus-wide events, offering detailed scheduling, attendance tracking, and report generation. A SQL database organizes and retrieves data efficiently; optimized queries ensure performance and scalability.

**List of System Users and Privileges**  
1. **Club Officers**  
   - Create, edit, and delete club events  
   - View and manage attendance records  
   - Track membership growth trends  
   - Generate reports on event participation  
   - Send notifications to members  

2. **Students**  
   - Register for club events and RSVP  
   - View upcoming and past events  
   - Track personal attendance history  
   - Receive event notifications  

3. **University Admins**  
   - Monitor club activities and events  
   - Generate compliance reports  
   - Oversee system security and integrity  

4. **Event Organizers**  
   - Manage event logistics  
   - Assign roles for event coordination  
   - Track real-time event participation  

**Entities and their Descriptions**  
1. Clubs – official student clubs and organizations  
2. Students – individuals enrolled who can attend events  
3. Events – club-organized events  
4. Attendance Records – student participation tracking  
5. Club Officers – students who manage clubs  
6. Membership Data – student enrollments in clubs  
7. University Admins – personnel overseeing club activities  
8. Event Organizers – individuals coordinating events  
9. Notifications – messages sent about event details  
10. Reports – generated attendance and participation metrics  

**Relationships**  
1. Clubs ↔ Students (Many-to-Many)  
2. Clubs → Club Officers (One-to-Many)  
3. Students → Attendance Records (One-to-Many)  
4. Clubs → Events (One-to-Many)  
5. Students ↔ Events (Many-to-Many)  
6. Events → Attendance Records (One-to-Many)  
7. University Admins → Clubs (One-to-Many)  
8. Event Organizers → Events (One-to-Many)  
9. Students → Notifications (One-to-Many)  
10. University Admins → Reports (One-to-Many)  

*Refer to `diagrams/ER Diagram - Phase 3.pdf` for the ER Diagram.*

---

## Phase 3: Logical Database Design & Schema Updates

**Updates and Modifications Based on Feedback**  
- Renamed generic schema labels to structured ones (Membership, Attendance, Event Organizers, etc.)  
- Added specific attributes:  
  - **STUDENTS:** email, last_name, major, classification  
  - **CLUBS:** club_name, club_budget, club_description  
  - **EVENTS:** event_id, event_location, event_date  
  - **ATTENDANCE:** attendance_id, check_in_time, check_out_time  
  - **UNIVERSITY ADMINS:** department, position_title, admin_id  
- **New Entity:** MEMBERSHIP_TRENDS (membership_id, student_id, club_id, membership_end_date)  
- Foreign keys added for integrity:  
  - club_id in Event_Organizers  
  - event_id in Attendance  
  - student_id in Membership  
  - club_id in Membership_Trends  

**Additional Features**  
- Expanded Event Organizers table with full organizer info  
- Introduced CLUB_OFFICERS table (officer_id, student_id, start/end dates, position_title)  
- Enabled both admins and club officers to generate reports  
- Enhanced Notifications table structure  

*Refer to `diagrams/Normalized Relational Schema - Phase 3.pdf`.*

---

## Phase 4: Schema Normalization & Data Population

**Finalized Schema**  
- Normalized to 3NF; eliminated redundant dependencies  
- Surrogate keys for all tables  
- Tables: clubs, students, memberships, club_officers, event_organizers, events, attendance, university_admins, notifications, membership_trends  

**PostgreSQL Connection**  
- Hosted on Supabase, database named `campus_club_management`  
- Managed via pgAdmin/psql  

**Data Population**  
- Each major table populated with 20+ tuples  
- Screenshots included for Attendance, Club Officers, Clubs, Event Organizers, Events, Membership, Membership Trends, Notifications, Students, University Admins  

*Refer to `diagrams/Data Population - Phase 5.pdf`.*

---

## Phase 5: Application Interface & CRUD Functionality

**App URL**  
[https://cs4604project.vercel.app](https://cs4604project.vercel.app)

**Insert Functionality**  
- “Add Role” button to assign students, officers, organizers, or admins  
- Form inputs update Supabase in real time  

**Update Functionality**  
- Profile editing for all roles; changes propagate to database immediately  

**Delete Functionality**  
- “Unaffiliate” button removes role assignments; reflects instantly in database  

*Refer to `diagrams/Functionality Screenshots - Phase 5.pdf`.*

---

## Statistical Reporting Examples

- Sample high-level and detailed reports are available in `diagrams/Statistical Reports (Examples).pdf`.

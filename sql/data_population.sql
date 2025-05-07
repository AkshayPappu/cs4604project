BEGIN;
-- This is just a file for data population, if you really want to look at our relational schema you should look at our supabase folder.
-- 1. STUDENTS
INSERT INTO students(email, first_name, last_name, major, classification) VALUES
  ('alice@vt.edu','Alice','Smith','CS','Senior'),
  ('bob@vt.edu','Bob','Jones','CE','Junior'),
  ('carol@vt.edu','Carol','Lee','IT','Sophomore'),
  ('dave@vt.edu','Dave','Patel','EE','Senior'),
  ('eve@vt.edu','Eve','Nguyen','CS','Senior'),
  ('frank@vt.edu','Frank','Kim','CE','Junior'),
  ('grace@vt.edu','Grace','Wang','IT','Sophomore'),
  ('henry@vt.edu','Henry','Lopez','EE','Senior'),
  ('ivy@vt.edu','Ivy','Gonzalez','CS','Junior'),
  ('jack@vt.edu','Jack','Garcia','CE','Sophomore'),
  ('kate@vt.edu','Kate','Martinez','IT','Senior'),
  ('leo@vt.edu','Leo','Davis','EE','Senior'),
  ('mia@vt.edu','Mia','Rodriguez','CS','Junior'),
  ('nick@vt.edu','Nick','Hernandez','CE','Sophomore'),
  ('olga@vt.edu','Olga','Lopez','IT','Senior'),
  ('pete@vt.edu','Pete','Wilson','EE','Junior'),
  ('quinn@vt.edu','Quinn','Anderson','CS','Sophomore'),
  ('rachel@vt.edu','Rachel','Thomas','CE','Senior'),
  ('sam@vt.edu','Sam','Moore','IT','Junior'),
  ('tina@vt.edu','Tina','Jackson','EE','Sophomore');

-- 2. CLUBS
INSERT INTO clubs(club_name, club_budget, club_description) VALUES
  ('Chess Club', 500.00, 'For chess enthusiasts'),
  ('Robotics Club', 1500.00, 'Build and program robots'),
  ('Art Club', 300.00, 'Painting and sculpture'),
  ('Music Club', 800.00, 'Instrumental and vocal music'),
  ('Drama Club', 700.00, 'Stage productions'),
  ('Coding Club', 1000.00, 'Hackathons and coding workshops'),
  ('Photography Club', 600.00, 'Digital and film photography'),
  ('Dance Club', 900.00, 'Various dance styles'),
  ('Book Club', 200.00, 'Literature discussions'),
  ('Gaming Club', 400.00, 'Board and video games'),
  ('Entrepreneurship Club', 1200.00, 'Startup ideas'),
  ('AI Club', 1300.00, 'Artificial Intelligence research'),
  ('Eco Club', 350.00, 'Environmental initiatives'),
  ('History Club', 250.00, 'Historical reenactment'),
  ('Math Club', 450.00, 'Problem solving'),
  ('Science Club', 550.00, 'Experiments and lectures'),
  ('Film Club', 650.00, 'Movie screenings'),
  ('Language Club', 300.00, 'Foreign language practice'),
  ('Volunteer Club', 500.00, 'Community service'),
  ('Finance Club', 700.00, 'Investment and markets');

-- 3. UNIVERSITY_ADMINS
INSERT INTO university_admins(email, department, position_title) VALUES
  ('admin1@vt.edu','Student Affairs','Coordinator'),
  ('admin2@vt.edu','Campus Life','Manager'),
  ('admin3@vt.edu','IT Services','Director');

-- 4. EVENTS
INSERT INTO events(club_id, event_name, event_date, event_location) VALUES
  (1,'Spring Chess Tournament','2025-04-10','Student Center'),
  (2,'Robotics Showcase','2025-03-15','Engineering Hall'),
  (3,'Art Expo','2025-05-01','Art Studio'),
  (4,'Jazz Night','2025-02-20','Music Hall'),
  (5,'Spring Play','2025-04-25','Drama Theater'),
  (6,'Hackathon','2025-03-01','CS Building'),
  (7,'Photo Walk','2025-04-05','Campus Grounds'),
  (8,'Dance Showcase','2025-03-20','Dance Studio'),
  (9,'Book Discussion','2025-02-28','Library Room 101'),
  (10,'LAN Party','2025-04-12','Gaming Lounge'),
  (11,'Startup Pitch','2025-03-18','Business Center'),
  (12,'AI Workshop','2025-04-22','AI Lab'),
  (13,'Tree Planting','2025-03-30','North Campus'),
  (14,'History Lecture','2025-04-15','Humanities Hall'),
  (15,'Math Contest','2025-02-25','Math Building'),
  (16,'Science Fair','2025-05-05','Science Hall'),
  (17,'Film Screening','2025-03-08','Cinema Hall'),
  (18,'Spanish Meetup','2025-04-18','Language Center'),
  (19,'Beach Cleanup','2025-03-28','Local Beach'),
  (20,'Stock Market Talk','2025-04-30','Finance Lab');

-- 5. CLUB_OFFICERS
INSERT INTO club_officers(student_id, club_id, officer_start_date, officer_end_date, position_title) VALUES
  (1,1,'2024-08-01',NULL,'President'),
  (2,2,'2024-09-01',NULL,'President'),
  (3,3,'2024-08-15',NULL,'Secretary'),
  (4,4,'2024-09-10',NULL,'Treasurer'),
  (5,5,'2024-08-20',NULL,'President'),
  (6,6,'2024-09-05',NULL,'Vice President'),
  (7,7,'2024-08-25',NULL,'Treasurer'),
  (8,8,'2024-09-12',NULL,'President'),
  (9,9,'2024-08-30',NULL,'Secretary'),
  (10,10,'2024-09-15',NULL,'President'),
  (11,11,'2024-08-05',NULL,'President'),
  (12,12,'2024-09-18',NULL,'Vice President'),
  (13,13,'2024-08-08',NULL,'Treasurer'),
  (14,14,'2024-09-20',NULL,'President'),
  (15,15,'2024-08-12',NULL,'Secretary'),
  (16,16,'2024-09-22',NULL,'President'),
  (17,17,'2024-08-18',NULL,'Treasurer'),
  (18,18,'2024-09-25',NULL,'President'),
  (19,19,'2024-08-22',NULL,'Vice President'),
  (20,20,'2024-09-28',NULL,'President');

-- 6. MEMBERSHIP
INSERT INTO membership(student_id, club_id, join_date) VALUES
  (1,1,'2023-09-01'),
  (2,2,'2023-09-05'),
  (3,3,'2023-09-10'),
  (4,4,'2023-09-15'),
  (5,5,'2023-09-20'),
  (6,6,'2023-09-25'),
  (7,7,'2023-09-30'),
  (8,8,'2023-10-05'),
  (9,9,'2023-10-10'),
  (10,10,'2023-10-15'),
  (11,11,'2023-10-20'),
  (12,12,'2023-10-25'),
  (13,13,'2023-10-30'),
  (14,14,'2023-11-05'),
  (15,15,'2023-11-10'),
  (16,16,'2023-11-15'),
  (17,17,'2023-11-20'),
  (18,18,'2023-11-25'),
  (19,19,'2023-11-30'),
  (20,20,'2023-12-05');

-- 7. MEMBERSHIP_TRENDS
INSERT INTO membership_trends(student_id, club_id, membership_end_date) VALUES
  (1,1,NULL),
  (2,2,NULL),
  (3,3,NULL),
  (4,4,NULL),
  (5,5,NULL),
  (6,6,NULL),
  (7,7,NULL),
  (8,8,NULL),
  (9,9,NULL),
  (10,10,NULL),
  (11,11,NULL),
  (12,12,NULL),
  (13,13,NULL),
  (14,14,NULL),
  (15,15,NULL),
  (16,16,NULL),
  (17,17,NULL),
  (18,18,NULL),
  (19,19,NULL),
  (20,20,NULL);

-- 8. ATTENDANCE
INSERT INTO attendance(event_id, student_id, check_in_time, check_out_time) VALUES
  (1,1,'2025-04-10 09:00','2025-04-10 12:00'),
  (1,2,'2025-04-10 09:15','2025-04-10 11:45'),
  (2,2,'2025-03-15 10:00','2025-03-15 13:00'),
  (2,3,'2025-03-15 10:05','2025-03-15 12:55'),
  (3,3,'2025-05-01 11:00','2025-05-01 14:00'),
  (3,4,'2025-05-01 11:10','2025-05-01 13:50'),
  (4,4,'2025-02-20 18:00','2025-02-20 20:00'),
  (4,5,'2025-02-20 18:05','2025-02-20 19:55'),
  (5,5,'2025-04-25 19:00','2025-04-25 22:00'),
  (5,6,'2025-04-25 19:10','2025-04-25 21:50'),
  (6,6,'2025-03-01 08:00','2025-03-01 20:00'),
  (6,7,'2025-03-01 08:15','2025-03-01 19:45'),
  (7,7,'2025-04-05 09:00','2025-04-05 11:00'),
  (7,8,'2025-04-05 09:10','2025-04-05 10:50'),
  (8,8,'2025-03-20 17:00','2025-03-20 19:00'),
  (8,9,'2025-03-20 17:05','2025-03-20 18:55'),
  (9,9,'2025-02-28 14:00','2025-02-28 16:00'),
  (9,10,'2025-02-28 14:10','2025-02-28 15:50'),
  (10,10,'2025-04-12 12:00','2025-04-12 18:00'),
  (10,11,'2025-04-12 12:15','2025-04-12 17:45');

-- 9. NOTIFICATIONS
INSERT INTO notifications(recipient_id, notification_message, notification_sent_at) VALUES
  (1,'Your Chess Tournament starts in one hour','2025-04-10 08:00'),
  (2,'Robotics Showcase tickets are available','2025-03-14 09:00'),
  (3,'Art Expo has been relocated','2025-04-30 10:00'),
  (4,'Jazz Night performer update','2025-02-19 17:00'),
  (5,'Spring Play rehearsal change','2025-04-24 18:00'),
  (6,'Hackathon kickoff tomorrow','2025-02-28 12:00'),
  (7,'Photo Walk meeting point changed','2025-04-04 08:00'),
  (8,'Dance Showcase details posted','2025-03-19 16:00'),
  (9,'Book Discussion theme revealed','2025-02-27 10:00'),
  (10,'LAN Party login info sent','2025-04-11 11:00'),
  (11,'Startup Pitch registration open','2025-03-17 09:00'),
  (12,'AI Workshop slides uploaded','2025-04-21 14:00'),
  (13,'Tree Planting volunteers needed','2025-03-29 07:00'),
  (14,'History Lecture venue moved','2025-04-14 12:00'),
  (15,'Math Contest bracket published','2025-02-24 15:00'),
  (16,'Science Fair judge assignments','2025-05-04 13:00'),
  (17,'Film Screening director Q&A','2025-03-07 18:00'),
  (18,'Spanish Meetup refreshments','2025-04-17 11:00'),
  (19,'Beach Cleanup start time','2025-03-27 09:00'),
  (20,'Stock Market Talk guest speaker','2025-04-29 10:00');

COMMIT;

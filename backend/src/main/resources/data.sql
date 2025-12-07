-- =========================================================================================================
-- 1. Core Users (Base for Student, Tutor, Coordinator)
-- =========================================================================================================
INSERT INTO users (user_id, full_name, email, phone_number, role, is_active) VALUES
  -- Students
  ('student-1', 'Emma Wilson',    'emma.wilson@hcmut.edu.vn',    '0901111111', 'STUDENT', 1),
  ('student-2', 'Sophia Davis',   'sophia.davis@hcmut.edu.vn',   '0902222222', 'STUDENT', 1),
  ('student-3', 'Michael Brown',  'michael.brown@hcmut.edu.vn',  '0903333333', 'STUDENT', 1),
  ('student-4', 'James Wilson',   'james.wilson@hcmut.edu.vn',   '0904444444', 'STUDENT', 1),
  ('student-5', 'Alex Student',   'alex.student@hcmut.edu.vn',   '0905555555', 'STUDENT', 1),
  ('student-6', 'Liam Johnson',   'liam.johnson@hcmut.edu.vn',   '0906666666', 'STUDENT', 1),
  ('student-7', 'Olivia Martinez','olivia.martinez@hcmut.edu.vn','0907777777', 'STUDENT', 1),
  ('student-8', 'Noah Anderson',  'noah.anderson@hcmut.edu.vn',  NULL,         'STUDENT', 0), -- Inactive student
  
  -- Tutors
  ('tutor-1',   'Dr. Jane Smith',    'jane.smith@hcmut.edu.vn',    '0911111111', 'TUTOR', 1),
  ('tutor-2',   'Prof. Robert Chen', 'robert.chen@hcmut.edu.vn',   '0912222222', 'TUTOR', 1),
  ('tutor-3',   'Sarah Connor',      'sarah.connor@hcmut.edu.vn',  '0913333333', 'TUTOR', 1),
  ('tutor-4',   'Alan Turing',       'alan.turing@hcmut.edu.vn',   '0914444444', 'TUTOR', 1),
  ('tutor-5',   'Grace Hopper',      'grace.hopper@hcmut.edu.vn',  NULL,         'TUTOR', 0), -- Inactive tutor

  -- Coordinators
  ('coordinator-1', 'Admin Coordinator', 'coordinator@hcmut.edu.vn', '0999999999', 'COORDINATOR', 1),
  ('coordinator-2', 'System Monitor',    'monitor@hcmut.edu.vn',     '0998888888', 'COORDINATOR', 1)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), email=VALUES(email), phone_number=VALUES(phone_number), is_active=VALUES(is_active);

-- =========================================================================================================
-- 2. Detailed Role Tables
-- =========================================================================================================
INSERT INTO students (user_id, major, gpa) VALUES
  ('student-1', 'Computer Science',       3.6),
  ('student-2', 'Information Systems',    3.4),
  ('student-3', 'Computer Engineering',   3.2),
  ('student-4', 'Software Engineering',   3.8),
  ('student-5', 'Computer Science',       3.1),
  ('student-6', 'Artificial Intelligence',3.9),
  ('student-7', 'Network Engineering',    2.8),
  ('student-8', 'Computer Science',       2.5)
ON DUPLICATE KEY UPDATE major=VALUES(major), gpa=VALUES(gpa);



INSERT INTO tutors (user_id, biography, average_rating) VALUES
  ('tutor-1', 'Ph.D. in Software Architecture with 10 years of teaching experience.', 4.8),
  ('tutor-2', 'Passionate about competitive programming and algorithmic efficiency.', 4.6),
  ('tutor-3', 'Certified Database Administrator specializing in big data.', 4.7),
  ('tutor-4', 'Researcher in Deep Learning and Neural Networks.', 5.0),
  ('tutor-5', 'Retired professor helping with legacy codebases.', 0.0)
ON DUPLICATE KEY UPDATE biography=VALUES(biography), average_rating=VALUES(average_rating);

INSERT INTO tutor_expertise (tutor_id, expertise_area) VALUES
  ('tutor-1', 'Java'), ('tutor-1', 'Databases'), ('tutor-1', 'Software Engineering'),
  ('tutor-2', 'Algorithms'), ('tutor-2', 'Data Structures'), ('tutor-2', 'Python'),
  ('tutor-3', 'Database Systems'), ('tutor-3', 'SQL'), ('tutor-3', 'NoSQL'),
  ('tutor-4', 'Artificial Intelligence'), ('tutor-4', 'Machine Learning'),
  ('tutor-5', 'Legacy Systems'), ('tutor-5', 'COBOL');

INSERT INTO coordinators (user_id, department_id) VALUES
  ('coordinator-1', 'DEPT-CSE-01'),
  ('coordinator-2', 'DEPT-ADMIN-02')
ON DUPLICATE KEY UPDATE department_id=VALUES(department_id);

-- =========================================================================================================
-- 3. Availability Slots (Future and Past)
-- =========================================================================================================
INSERT INTO availability_slots (slot_id, tutor_id, start_time, end_time, is_recurring, status) VALUES
  -- Future Available
  ('slot-1', 'tutor-1', '2026-01-05 09:00:00', '2026-01-05 11:00:00', 0, 'AVAILABLE'),
  ('slot-2', 'tutor-3', '2026-01-08 10:00:00', '2026-01-08 12:00:00', 0, 'AVAILABLE'),
  ('slot-3', 'tutor-1', '2026-01-15 15:00:00', '2026-01-15 17:00:00', 1, 'AVAILABLE'),
  ('slot-4', 'tutor-4', '2026-02-01 08:00:00', '2026-02-01 10:00:00', 1, 'AVAILABLE'),
  
  -- Future Booked
  ('slot-5', 'tutor-2', '2026-01-07 14:00:00', '2026-01-07 16:00:00', 1, 'BOOKED'),
  
  -- Past
  ('slot-6', 'tutor-1', '2023-12-01 09:00:00', '2023-12-01 10:00:00', 0, 'BOOKED')
ON DUPLICATE KEY UPDATE status=VALUES(status), start_time=VALUES(start_time), end_time=VALUES(end_time);

-- =========================================================================================================
-- 4. Sessions (Various Statuses and Modes)
-- =========================================================================================================
INSERT INTO sessions (session_id, student_id, tutor_id, topic, start_time, end_time, duration, mode, status, meeting_link, location) VALUES
  -- Completed Sessions (Past)
  ('session-1', 'student-1', 'tutor-1', 'Introduction to Java',       '2024-10-10 09:00:00', '2024-10-10 10:30:00', 90, 'ONLINE',    'COMPLETED', 'https://meet.example.com/s1', NULL),
  ('session-2', 'student-1', 'tutor-2', 'Data Structures Basics',     '2024-11-05 13:00:00', '2024-11-05 14:30:00', 90, 'IN_PERSON', 'COMPLETED', NULL, 'Room B1-301'),
  ('session-3', 'student-2', 'tutor-3', 'SQL Queries Optimization',   '2024-11-12 10:00:00', '2024-11-12 11:30:00', 90, 'ONLINE',    'COMPLETED', 'https://meet.example.com/s3', NULL),
  
  -- Scheduled Sessions (Future)
  ('session-4', 'student-1', 'tutor-1', 'Advanced Software Design',   '2026-01-20 14:00:00', '2026-01-20 15:30:00', 90, 'ONLINE',    'SCHEDULED', 'https://meet.example.com/s4', NULL),
  ('session-5', 'student-3', 'tutor-2', 'Graph Algorithms',           '2026-01-25 09:00:00', '2026-01-25 10:30:00', 90, 'IN_PERSON', 'SCHEDULED', NULL, 'Room C2-201'),
  ('session-6', 'student-4', 'tutor-1', 'Spring Boot Security',       '2026-02-10 16:00:00', '2026-02-10 17:30:00', 90, 'ONLINE',    'SCHEDULED', 'https://meet.example.com/s6', NULL),
  ('session-7', 'student-6', 'tutor-4', 'Neural Networks Intro',      '2026-02-15 08:00:00', '2026-02-15 09:30:00', 90, 'ONLINE',    'SCHEDULED', 'https://meet.example.com/s7', NULL),

  -- Cancelled Sessions
  ('session-8', 'student-5', 'tutor-2', 'Python for Beginners',       '2025-01-10 10:00:00', '2025-01-10 11:00:00', 60, 'ONLINE',    'CANCELED', NULL, NULL),
  
  -- Pending/Requested Sessions (if applicable to model)
  ('session-9', 'student-2', 'tutor-1', 'Microservices Patterns',     '2026-03-01 09:00:00', '2026-03-01 10:30:00', 90, 'ONLINE',    'SCHEDULED', NULL, NULL)
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- =========================================================================================================
-- 5. Matching Requests
-- =========================================================================================================
INSERT INTO matching_requests (request_id, student_id, tutor_id, subject, status, created_date) VALUES
  ('mr-1', 'student-1', 'tutor-1', 'Software Engineering', 'ACCEPTED', '2024-09-15 10:00:00'),
  ('mr-2', 'student-2', 'tutor-3', 'Database Systems',     'PENDING',  '2025-12-01 09:00:00'),
  ('mr-3', 'student-7', 'tutor-2', 'Basic Programming',    'REJECTED', '2024-11-20 11:00:00'),
  ('mr-4', 'student-6', 'tutor-4', 'AI Research',          'PENDING',  '2025-12-05 14:00:00')
ON DUPLICATE KEY UPDATE status=VALUES(status);

INSERT INTO matching_request_preferred_time_slots (request_id, time_slot) VALUES
  ('mr-1', '2024-09-20 09:00:00'),
  ('mr-2', '2025-12-10 10:00:00'),
  ('mr-2', '2025-12-12 14:00:00'),
  ('mr-3', '2024-11-25 15:00:00'),
  ('mr-4', '2025-12-15 08:00:00')
ON DUPLICATE KEY UPDATE time_slot=VALUES(time_slot);

-- =========================================================================================================
-- 6. Resources
-- =========================================================================================================
INSERT INTO resources (resource_id, title, description, linkurl, session_id, added_by_tutor_id) VALUES
  ('res-1', 'Java Basics Slides',      'Introduction to Java syntax and OOP.', 'https://example.com/java-basics',     'session-1', 'tutor-1'),
  ('res-2', 'AVL Trees Visualization', 'Interactive tool for AVL trees.',      'https://example.com/avl-viz',         'session-2', 'tutor-2'),
  ('res-3', 'SQL Cheatsheet',          'Quick reference for JOINs and indexes.','https://example.com/sql-cheatsheet', 'session-3', 'tutor-3'),
  ('res-4', 'Spring Boot Guide',       'Official documentation link.',          'https://spring.io/projects/spring-boot','session-6', 'tutor-1'),
  ('res-5', 'Deep Learning Book',      'Chapter 1 PDF.',                        'https://example.com/dl-book-ch1',     'session-7', 'tutor-4')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- =========================================================================================================
-- 7. Evaluations (Ratings & Comments)
-- =========================================================================================================
INSERT INTO evaluations (evaluation_id, session_id, student_id, rating_quality, satisfaction_level, comment, submitted_date) VALUES
  ('eval-1', 'session-1', 'student-1', 5, 5, 'Excellent explanation of OOP concepts!', '2024-10-11 10:00:00'),
  ('eval-2', 'session-2', 'student-1', 4, 4, 'Good, but the room was a bit noisy.',    '2024-11-06 09:00:00'),
  ('eval-3', 'session-3', 'student-2', 5, 5, 'Very helpful for my exam prep.',        '2024-11-13 14:00:00'),
  ('eval-4', 'session-8', 'student-5', 2, 2, 'Tutor cancelled last minute.',          '2025-01-11 12:00:00') -- Feedback on cancelled session?
ON DUPLICATE KEY UPDATE comment=VALUES(comment);

-- =========================================================================================================
-- 8. Progress Notes
-- =========================================================================================================
INSERT INTO progress_notes (note_id, tutor_id, student_id, session_id, content, created_date) VALUES
  ('note-1', 'tutor-1', 'student-1', 'session-1', 'Student grasped the concept of Polymorphism well.', '2024-10-10 11:00:00'),
  ('note-2', 'tutor-2', 'student-1', 'session-2', 'Needs more practice with recursion.',              '2024-11-05 15:00:00')
ON DUPLICATE KEY UPDATE content=VALUES(content);

-- =========================================================================================================
-- 9. Reports
-- =========================================================================================================
INSERT INTO reports (report_id, generated_by_coordinator_id, generated_date, report_type, criteria) VALUES
  ('rep-1', 'coordinator-1', '2024-12-01 09:00:00', 'STUDENT_ACTIVITY', '{"month": "11", "year": "2024"}'),
  ('rep-2', 'coordinator-1', '2025-01-01 09:00:00', 'TUTOR_PERFORMANCE', '{"tutorId": "tutor-1"}')
ON DUPLICATE KEY UPDATE generated_date=VALUES(generated_date);

-- =========================================================================================================
-- 10. Forum
-- =========================================================================================================
INSERT INTO forum_posts (post_id, author_id, title, content, created_date, status) VALUES
  ('post-1', 'student-1', 'How to prepare for Final Exam?', 'Any tips for the Software Engineering final?', '2024-12-10 10:00:00', 'OPEN'),
  ('post-2', 'tutor-1',   'Office Hours Changes',           'My office hours this week are shifted to Friday.', '2024-12-12 08:00:00', 'OPEN'),
  ('post-3', 'student-4', 'Looking for study group',        'Anyone want to study for Algorithms together?',    '2024-12-15 14:00:00', 'OPEN')
ON DUPLICATE KEY UPDATE title=VALUES(title);

INSERT INTO forum_replies (reply_id, post_id, author_id, content, created_date) VALUES
  ('reply-1', 'post-1', 'tutor-1',   'Focus on the lecture slides from weeks 10-12.', '2024-12-10 11:00:00'),
  ('reply-2', 'post-1', 'student-2', 'I have some summary notes if you want.',        '2024-12-10 12:00:00'),
  ('reply-3', 'post-3', 'student-5', 'I am interested! Let''s meet at the library.',  '2024-12-15 15:00:00')
ON DUPLICATE KEY UPDATE content=VALUES(content);

  -- Core users (base for Student/Tutor/Coordinator via JOINED inheritance)
  CREATE TABLE IF NOT EXISTS users (
    user_id       VARCHAR(64)  NOT NULL,
    full_name     VARCHAR(255),
    email         VARCHAR(255) UNIQUE,
    phone_number  VARCHAR(50),
    role          VARCHAR(20),
    sso_token     VARCHAR(255),
    is_active     TINYINT(1) DEFAULT 1,
    PRIMARY KEY (user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  -- Student, Tutor, Coordinator tables (inherit from users)
  CREATE TABLE IF NOT EXISTS students (
    user_id           VARCHAR(64) NOT NULL,
    major             VARCHAR(255),
    gpa               FLOAT,
    enrolled_courses  TEXT,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  CREATE TABLE IF NOT EXISTS tutors (
    user_id          VARCHAR(64) NOT NULL,
    expertise_areas  TEXT,
    biography        TEXT,
    average_rating   FLOAT,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_tutors_user FOREIGN KEY (user_id) REFERENCES users(user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  CREATE TABLE IF NOT EXISTS coordinators (
    user_id        VARCHAR(64) NOT NULL,
    department_id  VARCHAR(255),
    PRIMARY KEY (user_id),
    CONSTRAINT fk_coordinators_user FOREIGN KEY (user_id) REFERENCES users(user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  -- Sessions
  CREATE TABLE IF NOT EXISTS sessions (
    session_id   VARCHAR(64) NOT NULL,
    meeting_link VARCHAR(255),
    location     VARCHAR(255),
    student_id   VARCHAR(64),
    tutor_id     VARCHAR(64),
    topic        VARCHAR(255),
    start_time   DATETIME,
    end_time     DATETIME,
    duration     INT,
    mode         VARCHAR(20),
    status       VARCHAR(20),
    PRIMARY KEY (session_id),
    CONSTRAINT fk_sessions_student FOREIGN KEY (student_id) REFERENCES students(user_id),
    CONSTRAINT fk_sessions_tutor FOREIGN KEY (tutor_id) REFERENCES tutors(user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  -- Availability slots
  CREATE TABLE IF NOT EXISTS availability_slots (
    slot_id     VARCHAR(64) NOT NULL,
    tutor_id    VARCHAR(64),
    start_time  DATETIME,
    end_time    DATETIME,
    is_recurring TINYINT(1),
    status      VARCHAR(20),
    PRIMARY KEY (slot_id),
    CONSTRAINT fk_availability_tutor FOREIGN KEY (tutor_id) REFERENCES tutors(user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  -- Matching requests + preferred time slots (ElementCollection)
  CREATE TABLE IF NOT EXISTS matching_requests (
    request_id   VARCHAR(64) NOT NULL,
    student_id   VARCHAR(64),
    tutor_id     VARCHAR(64),
    subject      VARCHAR(255),
    status       VARCHAR(20),
    created_date DATETIME,
    PRIMARY KEY (request_id),
    CONSTRAINT fk_matching_student FOREIGN KEY (student_id) REFERENCES students(user_id),
    CONSTRAINT fk_matching_tutor FOREIGN KEY (tutor_id) REFERENCES tutors(user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  CREATE TABLE IF NOT EXISTS matching_request_preferred_time_slots (
    request_id  VARCHAR(64) NOT NULL,
    time_slot   DATETIME NOT NULL,
    PRIMARY KEY (request_id, time_slot),
    CONSTRAINT fk_mr_slots_request FOREIGN KEY (request_id) REFERENCES matching_requests(request_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  -- Resources
  CREATE TABLE IF NOT EXISTS resources (
    resource_id         VARCHAR(64) NOT NULL,
    title               VARCHAR(255),
    description         TEXT,
    external_library_id VARCHAR(255),
    linkurl             VARCHAR(255),
    added_by_tutor_id   VARCHAR(64),
    session_id          VARCHAR(64),
    PRIMARY KEY (resource_id),
    CONSTRAINT fk_resources_tutor FOREIGN KEY (added_by_tutor_id) REFERENCES tutors(user_id),
    CONSTRAINT fk_resources_session FOREIGN KEY (session_id) REFERENCES sessions(session_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  -- Evaluations
  CREATE TABLE IF NOT EXISTS evaluations (
    evaluation_id     VARCHAR(64) NOT NULL,
    session_id        VARCHAR(64) UNIQUE,
    student_id        VARCHAR(64),
    rating_quality    INT,
    satisfaction_level INT,
    comment           TEXT,
    submitted_date    DATETIME,
    PRIMARY KEY (evaluation_id),
    CONSTRAINT fk_evaluations_session FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    CONSTRAINT fk_evaluations_student FOREIGN KEY (student_id) REFERENCES students(user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  -- Progress notes
  CREATE TABLE IF NOT EXISTS progress_notes (
    note_id     VARCHAR(64) NOT NULL,
    tutor_id    VARCHAR(64),
    student_id  VARCHAR(64),
    session_id  VARCHAR(64),
    content     TEXT,
    created_date DATETIME,
    PRIMARY KEY (note_id),
    CONSTRAINT fk_notes_tutor FOREIGN KEY (tutor_id) REFERENCES tutors(user_id),
    CONSTRAINT fk_notes_student FOREIGN KEY (student_id) REFERENCES students(user_id),
    CONSTRAINT fk_notes_session FOREIGN KEY (session_id) REFERENCES sessions(session_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  -- Reports
  CREATE TABLE IF NOT EXISTS reports (
    report_id                  VARCHAR(64) NOT NULL,
    generated_by_coordinator_id VARCHAR(64),
    generated_date             DATETIME,
    criteria                   TEXT,
    report_type                VARCHAR(50),
    PRIMARY KEY (report_id),
    CONSTRAINT fk_reports_coordinator FOREIGN KEY (generated_by_coordinator_id) REFERENCES coordinators(user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  -- Forum posts and replies
  CREATE TABLE IF NOT EXISTS forum_posts (
    post_id      VARCHAR(64) NOT NULL,
    author_id    VARCHAR(64),
    title        VARCHAR(255),
    content      TEXT,
    created_date DATETIME,
    status       VARCHAR(20),
    PRIMARY KEY (post_id),
    CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES users(user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  CREATE TABLE IF NOT EXISTS forum_replies (
    reply_id     VARCHAR(64) NOT NULL,
    post_id      VARCHAR(64),
    author_id    VARCHAR(64),
    content      TEXT,
    created_date DATETIME,
    PRIMARY KEY (reply_id),
    CONSTRAINT fk_replies_post FOREIGN KEY (post_id) REFERENCES forum_posts(post_id),
    CONSTRAINT fk_replies_author FOREIGN KEY (author_id) REFERENCES users(user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  -- Seed minimal users/tutors/students so endpoints return data
  INSERT INTO users (user_id, full_name, email, role, is_active) VALUES
    ('student-1', 'Emma Wilson', 'emma.wilson@hcmut.edu.vn', 'STUDENT', 1),
    ('student-2', 'Sophia Davis', 'sophia.davis@hcmut.edu.vn', 'STUDENT', 1),
    ('student-3', 'Michael Brown', 'michael.brown@hcmut.edu.vn', 'STUDENT', 1),
    ('student-4', 'James Wilson', 'james.wilson@hcmut.edu.vn', 'STUDENT', 1),
    ('student-5', 'Alex Chen', 'alex.student@hcmut.edu.vn', 'STUDENT', 1),
    ('tutor-1',   'Dr. Jane Smith', 'jane.smith@hcmut.edu.vn', 'TUTOR', 1),
    ('tutor-2',   'Prof. Robert Chen', 'robert.chen@hcmut.edu.vn', 'TUTOR', 1),
    ('tutor-3',   'Alex Chen', 'alex.chen@hcmut.edu.vn', 'TUTOR', 1),
    ('coordinator-1', 'Coordinator', 'coordinator@hcmut.edu.vn', 'COORDINATOR', 1)
  ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

  INSERT INTO students (user_id, major, gpa, enrolled_courses) VALUES
    ('student-1', 'Computer Science', 3.6, '["CO3001","CO2003"]'),
    ('student-2', 'Information Systems', 3.4, '["CO2003","CO2013"]'),
    ('student-3', 'Computer Engineering', 3.2, '["CO3005","CO3001"]'),
    ('student-4', 'Software Engineering', 3.5, '["CO3001","CO3005"]'),
    ('student-5', 'Computer Science', 3.1, '["CO2013"]')
  ON DUPLICATE KEY UPDATE major=VALUES(major);

  INSERT INTO tutors (user_id, expertise_areas, biography, average_rating) VALUES
    ('tutor-1', '["Java","Databases","Software Engineering"]',
     'Faculty member focused on software architecture and mentoring.', 4.8),
    ('tutor-2', '["Algorithms","Data Structures","Python"]',
     'Researcher guiding students through algorithmic thinking.', 4.6),
    ('tutor-3', '["Database Systems","SQL","NoSQL"]',
     'Mentor specializing in data modeling and query optimization.', 4.7)
  ON DUPLICATE KEY UPDATE average_rating=VALUES(average_rating);

  -- Seed availability slots
  INSERT INTO availability_slots (slot_id, tutor_id, start_time, end_time, is_recurring, status) VALUES
    ('slot-1', 'tutor-1', '2025-01-05 09:00:00', '2025-01-05 10:00:00', 0, 'AVAILABLE'),
    ('slot-2', 'tutor-2', '2025-01-07 14:00:00', '2025-01-07 15:00:00', 1, 'BOOKED'),
    ('slot-3', 'tutor-3', '2025-01-08 10:00:00', '2025-01-08 11:00:00', 0, 'AVAILABLE'),
    ('slot-4', 'tutor-1', '2025-01-15 15:00:00', '2025-01-15 16:00:00', 1, 'AVAILABLE')
  ON DUPLICATE KEY UPDATE status=VALUES(status);

  -- Seed sessions
  INSERT INTO sessions (session_id, student_id, tutor_id, topic, start_time, end_time, duration, mode, status, meeting_link, location) VALUES
    ('session-1', 'student-1', 'tutor-1', 'CO3001 Software Engineering', '2026-01-10 09:00:00', '2026-01-10 10:30:00', 90, 'ONLINE', 'SCHEDULED', 'https://meet.example.com/session-1', NULL),
    ('session-2', 'student-1', 'tutor-2', 'CO2003 Data Structures', '2024-12-20 13:00:00', '2024-12-20 14:30:00', 90, 'IN_PERSON', 'COMPLETED', NULL, 'Room B1-301'),
    ('session-3', 'student-1', 'tutor-1', 'CO1001 Introduction to Programming', '2024-12-18 09:00:00', '2024-12-18 10:00:00', 60, 'ONLINE', 'COMPLETED', 'https://meet.example.com/session-3', NULL),
    ('session-4', 'student-1', 'tutor-2', 'CO3010 Software Project', '2026-01-12 09:00:00', '2026-01-12 10:00:00', 60, 'ONLINE', 'SCHEDULED', NULL, NULL),
    ('session-5', 'student-1', 'tutor-1', 'CO4001 Advanced Software Design', '2026-01-20 14:00:00', '2026-01-20 15:30:00', 90, 'ONLINE', 'SCHEDULED', 'https://meet.example.com/session-5', NULL),
    ('session-6', 'student-1', 'tutor-2', 'CO2005 Data Structures Review', '2026-01-25 09:00:00', '2026-01-25 10:00:00', 60, 'IN_PERSON', 'SCHEDULED', NULL, 'Room C2-201'),
    ('session-7', 'student-2', 'tutor-3', 'CO2013 Database Systems', '2026-02-05 10:00:00', '2026-02-05 11:30:00', 90, 'ONLINE', 'SCHEDULED', 'https://meet.example.com/session-7', NULL),
    ('session-8', 'student-3', 'tutor-1', 'CO3005 Programming Languages', '2026-02-10 16:00:00', '2026-02-10 17:30:00', 90, 'ONLINE', 'SCHEDULED', 'https://meet.example.com/session-8', NULL),
    ('session-9', 'student-4', 'tutor-2', 'CO3001 Software Engineering', '2026-02-12 13:00:00', '2026-02-12 14:30:00', 90, 'ONLINE', 'SCHEDULED', 'https://meet.example.com/session-9', NULL)
  ON DUPLICATE KEY UPDATE status=VALUES(status);

  -- Seed matching requests and preferred slots
  INSERT INTO matching_requests (request_id, student_id, tutor_id, subject, status, created_date) VALUES
    ('mr-1', 'student-1', 'tutor-1', 'Software Engineering', 'PENDING', '2024-12-15 10:00:00'),
    ('mr-2', 'student-2', 'tutor-3', 'Database Systems', 'PENDING', '2024-12-18 09:00:00'),
    ('mr-3', 'student-3', 'tutor-1', 'Programming Languages', 'PENDING', '2024-12-20 11:00:00')
  ON DUPLICATE KEY UPDATE status=VALUES(status);

  INSERT INTO matching_request_preferred_time_slots (request_id, time_slot) VALUES
    ('mr-1', '2024-12-22 09:00:00'),
    ('mr-1', '2024-12-23 09:00:00'),
    ('mr-2', '2024-12-24 10:00:00'),
    ('mr-3', '2024-12-26 14:00:00')
  ON DUPLICATE KEY UPDATE time_slot=VALUES(time_slot);

  -- Seed resources
  INSERT INTO resources (resource_id, title, description, linkurl, session_id) VALUES
    ('res-1', 'Software Engineering Process Overview', 'Slides and reading list for the CO3001 course.', 'https://example.com/resource/1', 'session-1'),
    ('res-2', 'Algorithms Cheatsheet', 'Short notes for quick revision.', 'https://example.com/resource/2', 'session-4'),
    ('res-3', 'Database Normalization Guide', 'Reference for 1NF/2NF/3NF/BCNF', 'https://example.com/resource/3', 'session-7'),
    ('res-4', 'UML Diagrams Tutorial', 'Comprehensive guide to UML diagrams.', 'https://example.com/resource/4', 'session-1'),
    ('res-5', 'Design Patterns Reference', 'Quick reference guide for common software design patterns', 'https://example.com/resource/5', 'session-5')
  ON DUPLICATE KEY UPDATE title=VALUES(title);

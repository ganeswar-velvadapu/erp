CREATE EXTENSION IF NOT EXISTS "uuid-ossp"

CREATE TABLE students(
student_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
student_name VARCHAR(100) NOT NULL,
student_email VARCHAR(150) NOT NULL,
student_password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

ALTER TABLE students
ADD COLUMN role VARCHAR(50) DEFAULT 'student';


ALTER TABLE students
ADD COLUMN registered_courses JSONB DEFAULT '[]'; 
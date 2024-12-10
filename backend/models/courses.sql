CREATE TABLE courses (
    course_id VARCHAR(10) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    professor_id UUID REFERENCES professors(professor_id) ON DELETE SET NULL,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE courses
ADD COLUMN registered_students JSONB DEFAULT '[]'; 
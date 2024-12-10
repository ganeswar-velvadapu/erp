
CREATE TABLE professors (
    professor_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    professor_name VARCHAR(100) NOT NULL,
    professor_email VARCHAR(150) UNIQUE NOT NULL,
    professor_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE professors
ADD COLUMN role VARCHAR(50) DEFAULT 'professor';
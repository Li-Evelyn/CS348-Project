-- CREATE TABLE QUERIES

-- types of users
CREATE TYPE usertype AS ENUM (
    'student', 
    'staff', 
    'admin'
);

-- users entity - make sure to refer to this table using double quotes
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY, 
    name TEXT NOT NULL, 
    email TEXT NOT NULL UNIQUE, 
    password_hash TEXT NOT NULL, 
    type USERTYPE
);

-- courses entity
CREATE TABLE Course (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- teaches relation
CREATE TABLE Teaches (
    course_id INT,
    staff_id INT,
    FOREIGN KEY (staff_id) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE
);

-- enrolledin relation
CREATE TABLE EnrolledIn (
    course_id INT,
    student_id INT, 
    FOREIGN KEY (student_id) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE
);

-- assignment entity
CREATE TABLE Assignment (
    id SERIAL PRIMARY KEY,
    course_id INT,
    name TEXT NOT NULL,
    deadline TIMESTAMP,
    max_grade INT CHECK (max_grade >= 0),
    description TEXT DEFAULT '',
    UNIQUE (course_id, name),
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, name)
);

-- question entity
CREATE TABLE Question (
    assignment_id INT,
    number INT,
    max_grade INT CHECK (max_grade >= 0),
    description TEXT DEFAULT '',
    FOREIGN KEY (assignment_id) REFERENCES Assignment(id) ON DELETE CASCADE,
    PRIMARY KEY (assignment_id, number)
);

-- questionsubmission relation
CREATE TABLE QuestionSubmission (
    student_id INT,
    assignment_id INT,
    question_number INT,
    file_path TEXT DEFAULT '',
    grade INT CHECK (grade >= 0),
    staff_comments TEXT DEFAULT '',
    FOREIGN KEY (student_id) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (assignment_id, question_number) REFERENCES Question(assignment_id, number) ON DELETE CASCADE,
    PRIMARY KEY (student_id, assignment_id, question_number)
);

-- assignmentsubmission relation
CREATE TABLE AssignmentSubmission (
    student_id INT,
    assignment_id INT
    grade INT,
    is_submitted BOOLEAN,
    FOREIGN KEY (student_id) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES Assignment(id) ON DELETE CASCADE
);

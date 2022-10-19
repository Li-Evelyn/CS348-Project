-- ONLY FOR NOTES - these are not being read from. add any functioning queries to server/query.js in the relevant spot

-- CREATE TABLE QUERIES

-- types of users
CREATE TYPE usertype AS ENUM (
    'student', 
    'faculty', 
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
    FOREIGN KEY (staff_id) REFERENCES "User"(id),
    FOREIGN KEY (course_id) REFERENCES course(id)
);

-- enrolledin relation
CREATE TABLE EnrolledIn (
    course_id INT,
    student_id INT, 
    FOREIGN KEY (student) REFERENCES "User"(id),
    FOREIGN KEY (course_id) REFERENCES Course(id)
);

-- assignment entity
CREATE TABLE Assignment (
    course_id INT,
    name TEXT NOT NULL,
    deadline TIMESTAMP,
    max_grade INT CHECK (max_grade >= 0),
    FOREIGN KEY (course_id) REFERENCES Course(id),
    PRIMARY KEY (course_id, name)
);

-- question entity, can add an ON DELETE CASCADE to the first line
CREATE TABLE Question (
    course_id INT,
    assignment_name TEXT NOT NULL,
    number INT,
    max_grade INT CHECK (max_grade >= 0),
    description TEXT DEFAULT '',
    FOREIGN KEY (course_id, assignment_name) REFERENCES Assignment(course_id, name),
    PRIMARY KEY (course_id, assignment_name, number)
);

-- questionsubmission relation
-- note on composite keys: https://stackoverflow.com/questions/9780163/composite-key-as-foreign-key-sql
-- maybe add another check on the grade back to the question?
CREATE TABLE QuestionSubmission (
    student_id INT,
    course_id INT,
    assignment_name TEXT NOT NULL,
    question_number INT,
    file_path TEXT DEFAULT '',
    grade INT CHECK (grade >= 0),
    staff_comments TEXT DEFAULT '',
    FOREIGN KEY (student_id) REFERENCES "User"(id),
    FOREIGN KEY (course_id, assignment_name, question_number) REFERENCES Question(course_id, assignment_name, number),
    PRIMARY KEY (student_id, course_id, assignment_name, question_number)
);

-- assignmentsubmission relation
CREATE TABLE AssignmentSubmission (
    student_id INT,
    course_id INT,
    assignment_name TEXT NOT NULL,
    grade INT,
    is_submitted BOOLEAN,
    FOREIGN KEY (student_id) REFERENCES "User"(id),
    FOREIGN KEY (course_id, assignment_name) REFERENCES Assignment(course_id, name)
);


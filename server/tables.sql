--delete a table
DROP TABLE table;

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
    username TEXT NOT NULL UNIQUE, 
    password TEXT NOT NULL, 
    displayname TEXT NOT NULL, 
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
    FOREIGN KEY (course_id) REFERENCES course(id),
    FOREIGN KEY (staff_id) REFERENCES "User"(id)
);

-- enrolledin relation
CREATE TABLE EnrolledIn (
    user_id INT, 
    course_id INT,
    FOREIGN KEY (user_id) REFERENCES "User"(id),
    FOREIGN KEY (course_id) REFERENCES Course(id)
);

-- assignment entity
CREATE TABLE Assignment (
    id SERIAL PRIMARY KEY,
    course_id INT,
    name TEXT NOT NULL,
    deadline DATE,
    max_grade INT CHECK (max_grade >= 0),
    FOREIGN KEY (course_id) REFERENCES Course(id)
);

-- question entity, can add an ON DELETE CASCADE to the first line
CREATE TABLE Question (
    assignment_id INT,
    num INT,
    description TEXT,
    max_grade INT CHECK (max_grade >= 0),
    FOREIGN KEY (assignment_id) REFERENCES Assignment(id),
    PRIMARY KEY (assignment_id, num)
);

CREATE TABLE File (
    id SERIAL PRIMARY KEY,
    fname TEXT,
    fpath TEXT
);

-- questionsubmission relation
-- note on composite keys: https://stackoverflow.com/questions/9780163/composite-key-as-foreign-key-sql
-- maybe add another check on the grade back to the question?
CREATE TABLE QuestionSubmission (
    user_id INT,
    assignment_id INT,
    num INT,
    file_id INT DEFAULT NULL,
    grade INT CHECK (grade >= 0),
    comments TEXT DEFAULT '',
    FOREIGN KEY (user_id) REFERENCES "User"(id),
    FOREIGN KEY (assignment_id, num) REFERENCES Question(assignment_id, num),
    FOREIGN KEY (file_id) REFERENCES File(id)
);

-- assignmentsubmission relation
CREATE TABLE AssignmentSubmission (
    user_id INT,
    assignment_id INT,
    grade INT,
    is_submitted BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES "User"(id),
    FOREIGN KEY (assignment_id) REFERENCES Assignment(id)
);


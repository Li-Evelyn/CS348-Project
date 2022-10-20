-- ONLY FOR NOTES - these are not being read from. add any functioning queries to server/query.js in the relevant spot

-- COPY TABLE QUERIES (load from files - pathname must be specified - i put them into a public folder)

COPY "User" (name, username, password_hash, type)
FROM 'pathname\user.csv'
DELIMITER ','
CSV HEADER;

COPY Course (name)
FROM 'pathname\course.csv'
DELIMITER ','
CSV HEADER;

COPY Teaches (course_id, staff_id)
FROM 'pathname\teaches.csv'
DELIMITER ','
CSV HEADER;

COPY EnrolledIn (course_id, student_id)
FROM 'pathname\enrolledin.csv'
DELIMITER ','
CSV HEADER;

COPY Assignment (course_id, name, deadline, max_grade)
FROM 'pathname\assignment.csv'
DELIMITER ','
CSV HEADER;

COPY Question (course_id, assignment_name, number, max_grade, description)
FROM 'pathname\question.csv'
DELIMITER ','
CSV HEADER;

COPY QuestionSubmission (student_id, course_id, assignment_name, question_number, file_path, grade, staff_comments)
FROM 'pathname\question_submission.csv'
DELIMITER ','
CSV HEADER;

COPY AssignmentSubmission (student_id, course_id, assignment_name, grade, is_submitted)
FROM 'pathname\assignment_submission.csv'
DELIMITER ','
CSV HEADER;
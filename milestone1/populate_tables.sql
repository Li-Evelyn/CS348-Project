-- COPY TABLE QUERIES (load from files - pathname must be specified)

COPY "User" (name, username, password_hash, type)
FROM './server/sample_data/user.csv'
DELIMITER ','
CSV HEADER;

COPY Course (name)
FROM './server/sample_data/course.csv'
DELIMITER ','
CSV HEADER;

COPY Teaches (course_id, staff_id)
FROM './server/sample_data/teaches.csv'
DELIMITER ','
CSV HEADER;

COPY EnrolledIn (course_id, student_id)
FROM './server/sample_data/enrolledin.csv'
DELIMITER ','
CSV HEADER;

COPY Assignment (course_id, name, deadline, max_grade, description)
FROM './server/sample_data/assignment.csv'
DELIMITER ','
CSV HEADER;

COPY Question (course_id, assignment_name, number, max_grade, description)
FROM './server/sample_data/question.csv'
DELIMITER ','
CSV HEADER;

COPY QuestionSubmission (student_id, course_id, assignment_name, question_number, file_path, grade, staff_comments)
FROM './server/sample_data/question_submission.csv'
DELIMITER ','
CSV HEADER;

COPY AssignmentSubmission (student_id, course_id, assignment_name, grade, is_submitted)
FROM './server/sample_data/assignment_submission.csv'
DELIMITER ','
CSV HEADER;
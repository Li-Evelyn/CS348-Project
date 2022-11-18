--Feature 1: Creation
/* There are many things that we need to create for our application, but since the
query structure is generally the same, we will have it all be one feature. */
-- Example: Create User (after registration)

SELECT * FROM "User"
ORDER BY id DESC
LIMIT 10;

INSERT INTO "User" (email, password_hash, name, type) 
VALUES ('modell3@uwaterloo.ca', 'testpassword', 'maxodell3', 'student');

SELECT * FROM "User"
ORDER BY id DESC
LIMIT 10;

-- Example: Verifying User login
CREATE INDEX idx_user_email ON "User" (email, password_hash);

SELECT * FROM "User" WHERE email='laikenheadh@printfriendly.com' AND password_hash='4ldlYxl5k';

DROP INDEX idx_user_email;

--Feature 2: Lookup/View
/* There are also many things that can be viewed by a user, but the main one 
we'll show is what classes a student is enrolled in / what classes a staff member teaches. */
--Example Student View Courses
CREATE INDEX idx_student_id ON EnrolledIn(student_id, course_id);
-- CREATE INDEX idx_course_id ON Course(id, name);

SELECT name FROM Course
WHERE id IN (
    SELECT course_id FROM EnrolledIn
    WHERE student_id = 126
);

DROP INDEX idx_student_id;
-- DROP INDEX idx_course_id;

--Feature 3: Updating Information
/*This feature is crucial for our platform, shown in our main example of adding a grade to an assignment.
This feature is needed to add or modify a grade in case of a re-mark. */
--Example: Add Grade

SELECT * FROM AssignmentSubmission WHERE student_id=116 AND assignment_id = 5;

UPDATE AssignmentSubmission
SET grade = 100
WHERE student_id=116 AND assignment_id = 5;

SELECT * FROM AssignmentSubmission WHERE student_id=116 AND assignment_id = 5;

--Feature 4: Deleting From Tables
/* This feature can be used in a few instances, but most notably when a student drops a course. */
--Example: Drop Course

SELECT * FROM EnrolledIn WHERE course_id = 1;

DELETE FROM EnrolledIn
WHERE student_id = 176 AND course_id = 1;

SELECT * FROM EnrolledIn WHERE course_id = 1;

--Feature 5: Aggregating Tables
/* This feature will be used for many different small tidbits in the site, such as calculating
means and/or medians of questions + assignments*/
--Example: Calculating the mean grade of an assignment
CREATE INDEX idx_assignment_id ON AssignmentSubmission(assignment_id, grade);

SELECT AVG(grade)
FROM AssignmentSubmission
WHERE assignment_id = 1;

--Feature 6: Grade Distribution
/* This feature will be used for displaying the grade distribution for a given assignment*/
--Example: Display grade distribution of an assignment

SELECT COUNT(*), FLOOR(grade/10)*10 AS grade_range FROM AssignmentSubmission
WHERE assignment_id = 1 AND grade IS NOT NULL
GROUP BY grade_range
ORDER BY grade_range ASC;

DROP INDEX idx_assignment_id;
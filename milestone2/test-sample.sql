--Feature 1: Creation
/* There are many things that we need to create for our application, but since the
query structure is generally the same, we will have it all be one feature. */
-- Example: Create User (after registration)

SELECT * FROM "User";

INSERT INTO "User" (email, password_hash, name, type) 
VALUES ('modell3@uwaterloo.ca', 'testpassword', 'maxodell3', 'student');

SELECT * FROM "User";

--Feature 2: Lookup/View
/* There are also many things that can be viewed by a user, but the main one 
we'll show is what classes a student is enrolled in / what classes a staff member teaches. */
--Example Student View Courses

SELECT name FROM Course 
WHERE id IN (
    SELECT course_id FROM EnrolledIn
    WHERE student_id = 21
);


--Feature 3: Updating Information
/*This feature is crucial for our platform, shown in our main example of adding a grade to an assignment.
This feature is needed to add or modify a grade in case of a re-mark. */
--Example: Add Grade

SELECT * FROM AssignmentSubmission WHERE student_id=25 AND assignment_id = 7;

UPDATE AssignmentSubmission
SET grade = 100
WHERE student_id=25 AND assignment_id = 7;

SELECT * FROM AssignmentSubmission WHERE student_id=25 AND assignment_id = 7;

--Feature 4: Deleting From Tables
/* This feature can be used in a few instances, but most notably when a student drops a course. */
--Example: Drop Course

SELECT * FROM EnrolledIn WHERE course_id = 6;

DELETE FROM EnrolledIn
WHERE student_id = 28 AND course_id = 6;

SELECT * FROM EnrolledIn WHERE course_id = 6;

--Feature 5: Aggregating Tables
/* This feature will be used for many different small tidbits in the site, such as calculating
means and/or medians of questions + assignments*/
--Example: Calculating the mean grade of an assignment

SELECT AVG(grade)
FROM AssignmentSubmission
WHERE assignment_id = 1;

--Feature 6: Grade Distribution
/* This feature will be used for displaying the grade distribution for a given assignment*/
--Example: Display grade distribution of an assignment

WITH grade_ranges(user_id, assignment_id, grade_range) AS
    (SELECT student_id, assignment_id, FLOOR(grade/10)*10 FROM
    Assignment JOIN AssignmentSubmission ON Assignment.id = AssignmentSubmission.assignment_id
    WHERE grade IS NOT NULL)
SELECT COUNT(*), grade_range FROM grade_ranges
WHERE assignment_id = 3
GROUP BY grade_range
ORDER BY grade_range ASC;
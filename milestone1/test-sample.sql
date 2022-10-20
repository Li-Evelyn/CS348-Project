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

SELECT * FROM AssignmentSubmission WHERE student_id=25 AND course_id=5 AND assignment_name='A1';

UPDATE AssignmentSubmission
SET grade = 100
WHERE student_id=25 AND course_id=5 AND assignment_name='A1';

SELECT * FROM AssignmentSubmission WHERE student_id=25 AND course_id=5 AND assignment_name='A1';

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

SELECT AVG(FullAssignDetails.grade)
FROM (AssignmentSubmission NATURAL JOIN Assignment) as FullAssignDetails
WHERE FullAssignDetails.name='Assignment 1' AND FullAssignDetails.course_id=1;
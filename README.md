# CS348-Project

## Development Setup
### Database (PostgreSQL)
1. Download Postgres for your platform from https://www.postgresql.org/download/. 
2. Once installation finishes, launch your choice of SQL shell (I used psql, and the following instructions will generally pertain to that). 
3. Create a new database using `createdb cs348`. Verify that it has been created with `\l`.
4. Switch to your new database with `\c cs348`. There will currently be no relations (you can see by using `\dt`).
5. Create the (currently test) table as follows: `CREATE TABLE test (id SERIAL PRIMARY KEY, content TEXT NOT NULL);`.
6. (Optional) Populate the table with `INSERT INTO test (content) VALUES ('hello');` `INSERT INTO test (content) VALUES ('world');` and test with `SELECT * FROM test;`.
7. You have now finished setting up the database. You will create the relevant project relations during the Backend Setup.
Note: Use `\conninfo` to see information about your database (it was useful for generating the DATABASE_URL)

### Backend (Node/Express)
1. Navigate to `/server`, initialize Node with `npm init`, and install the required libraries with `npm install`.
2. Create a `.env` file in `/server` with the contents `DB_USER="(your postgres user)"` and `DB_PASSWORD="(your postgres password)"` in `/server`, and also `SALT=""` (empty for now) in the same file.
3. Verify that the server runs with `npm start` and navigate to http://localhost:8080/. You should see a "Hello World" message.
4. Navigate to http://localhost:8080/query/create to create the project's relations. You should see output that looks like this: `{"data":{"0":{"rows":[]},"1":{"rows":[]},"2":{"rows":[]},"3":{"rows":[]},"4":{"rows":[]},"5":{"rows":[]},"6":{"rows":[]},"7":{"rows":[]},"8":{"rows":[]}}}`. To verify that the tables have been created, you can use `\dt` in your SQL shell.
* To reset the database (reset the schema by removing all tables and types), navigate to http://localhost:8080/query/drop. You should see output similar to the above but with only four elements.
5. WINDOWS ONLY - Download and store the available csv files (currently, only the "User" table gets populated) in a publicly-accessible folder (on Windows, I used C:\Users\Public\Documents, created another folder "cs348_csvs", and saved the csv files in there). Add the parent path of the csv files (for me, it was `C:\Users\Public\Documents\cs348_csvs\`) as a new environment variable: `CSV_PATH="(your csv path)"`. **Important**: For every backslash, be sure to add an additional backslash.
FOR MAC ONLY - Navigate to your true root file (before Users) and there will be a temp shared directory called /tmp. Copy the sample_data there and add the path as a variable to your .env as such: `CSV_PATH="/tmp/sample_data"`.
6. Navigate to http://localhost:8080/query/populate. You should see an empty row object - you can now use your SQL shell or use the frontend debug page to verify that the table(s) have been populated correctly.
7. You have now finished setting up the backend. Note: For testing/debugging, you can visit http://localhost:8080/query/reset to call drop, create, and populate in succession.

### Frontend (React)
1. Navigate to `/client` and use `npm install`.
2. You have now finished setting up the frontend (and the app). Verify that it works by running it with `npm start` and going to http://localhost:3000.
3. To see changes from the database reflected in the frontend, I've also added a developer (Debug) page where you can see each table.

## Citations
Tutorials used:
* Table creation: https://www.educba.com/postgresql-list-tables/
* Connecting backend to database: https://dev.to/miku86/nodejs-postgresql-how-to-connect-our-database-to-our-simple-express-server-without-an-orm-10o0
* Connecting frontend to backend: https://rapidapi.com/blog/create-react-app-express/
* Making things generically prettier: https://react-bootstrap.github.io/components/alerts
* Basic (very insecure) authentication: https://www.makeuseof.com/redirect-user-after-login-react/
---

## Milestone 1
Note: How to create/load the sample database is described in the development setup above (Backend steps 4-6). How to run the application is also described in the development setup (after setup is finished, Backend step 3 and Frontend step 2).

### Supported Features
**See /milestone1 for queries and output from running the queries on our sample data, and the submitted report.pdf for how to test non-query-only features.**
* R6. Registration (All Users)
* R7. View Courses (Student)
* R8. Update Assignment Submission Grade (Staff) - query only
* R9. Drop Courses (Student)
* R10. Average Grade - query only

### Developer/Admin Tools
* Debug screen for viewing tables
* `/test` endpoint for testing arbitrary queries against the database
* `/query/reset` endpoing for combining drop, create, and populate table queries

### User Interface
* Routing
* Homepage
* Login/Registration pages, authentication, and queries; logging out (TODO: update navbar on login/register automatically)
* Student Dashboard (with authentication gating) displaying list of courses (TODO: individual assignment pages), unenrollment

---

## Milestone 2
Note: If you were previously signed in to a user's account, please log out and update your local files with the new production data found in `/server/production_data` as described in Backend Step 5

### Supported Features
**See /milestone2 for queries and output from running the queries on our production dataset and the submitted report.pdf for how to test non-query-only features.**
* R6. Registration (All Users)
* R7. View Courses (Student)
* R8. Update Assignment Submission Grade (Staff) - query only
* R9. Drop Courses (Student)
* R10. Average Grade - query only
* R11. Assignment Grade Distribution (All Users) - query only

### Developer/Admin Tools/Improvements
* Updated schemas (`ON DELETE CASCADE` for foreign keys, adding serialized `id` field to the assignment table as a primary key)
* SQL Injection protection, better backend architecture
* Fixed Debug page to reflect updated schemas

### User Interface
* Dynamic dashboard for all users
* Staff Course/Assignment View (TODO: grading interface/functionality)
* Student Assignment/Question View (TODO: proper form submission for questions)

---

## Final Submission
Note: If you were previously signed in to a user's account, please log out and update your local files with the new production data found in `/server/production_data` as described in Backend Step 5. Additionally, when logging in as any user, use the passwords found in `user_password.csv` (as `user.csv` only contains password hashes)

### Supported Features
**See report.pdf for testing steps.**
* R6. Registration (All Users)
* R7. View Courses/Assignments/Questions (Student)
* R8. Update Assignment Submission Grade (Staff)
* R9. Drop Courses (Student)
* R10. Average Grade (All Users)
* R11. Assignment Grade Distribution (All Users)

### Other Notable (Fancy) Features
**See report.pdf for descriptions of fancy features.**
* R12. UI Design (https://www.canva.com/design/DAFPXFalvFE/1tmCJuwTaXe1dwQ2L53zoA/view)
* R13. Increased Security (SQL injection protection via sanitized queries, password hashing)
* R14. View/Delete Courses/Assignments (Staff)
* R15. Unit Testing (`/server/test`)
* R16. File Upload/Viewing
* Navigation gating for different user types (i.e. only admin users can see the debug page, only staff users can create/delete courses and assignments, only students can upload files and submit assignments)
* Deadline gating for student assignment submissions (after the deadline for an assignment has passed, students cannot create a submission)
* Staff can enroll and unenroll students from a course that they teach
* Staff can view all students in their courses and see which students have created a submission for any particular assignment
* Staff can create assignments and questions, and the relevant AssignmentSubmission entities will be created automatically (with QuestionSubmissions being created when students submit their assignments)
* CrowdMark-like assignment statistics on assignment pages

# CS348-Project
F22 C348 project

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
2. Create a `.env` file in `/server` with the contents `DB_USER="(your postgres user)"` and `DB_PASSWORD="(your postgres password)"` in `/server`.
3. Verify that the server runs with `npm start` and navigate to http://localhost:8080/. You should see a "Hello World" message.
4. Navigate to http://localhost:8080/query/create to create the project's relations. You should see output that looks like this: `{"data":{"0":{"rows":[]},"1":{"rows":[]},"2":{"rows":[]},"3":{"rows":[]},"4":{"rows":[]},"5":{"rows":[]},"6":{"rows":[]},"7":{"rows":[]},"8":{"rows":[]},"9":{"rows":[]}}}`. To verify that the tables have been created, you can use `\dt` in your SQL shell.
5. To reset the database (reset the schema by removing all tables and types), navigate to http://localhost:8080/query/drop. You should see output similar to the above but with only four elements.
6. You have now finished setting up the Backend.

### Frontend (React)
1. Navigate to `/client` and use `npm install`.
2. You have now finished setting up the frontend (and the app). Verify that it works by running it with `npm start` and going to http://localhost:3000 (if you skipped step 6 during the Database setup, the homepage will be blank).
3. To see changes from the database reflected in the frontend, I've also added a developer (Debug) page where you can see, add, and delete from the test database.

## Citations
Tutorials used:
* Table creation: https://www.educba.com/postgresql-list-tables/
* Connecting backend to database: https://dev.to/miku86/nodejs-postgresql-how-to-connect-our-database-to-our-simple-express-server-without-an-orm-10o0
* Connecting frontend to backend: https://rapidapi.com/blog/create-react-app-express/
* Making things generically prettier: https://react-bootstrap.github.io/components/alerts

## TODO:
### General
- [ ] Database design (what tables do we need? How are they linked?)
- [ ] Create said tables 
- [ ] Build pages and methods for adding to said tables
- [ ] Load DB from files?
- [ ] Make things prettier

### Functionality
Course Staff:
- [ ] Enroll students in courses
- [ ] Create/delete assignments
- [ ] View submitted files from student assignments
- [ ] Enforce deadlines for assignments
- [ ] Grade assignments
- [ ] Comment on assignments
- [ ] (?) View stats about assignments

Students:
- [ ] Upload files to assignments for their courses
- [ ] View uploaded files
- [ ] See assignment/course grades

# CS348-Project
F22 C348 project

## Development Setup
### Database (PostgreSQL)
1. Download Postgres for your platform from https://www.postgresql.org/download/. 
2. Once installation finishes, launch your choice of SQL Shell (I used psql). 
3. Create a new database using `createdb cs348`. Verify that it has been created with `\l`.
4. Switch to your new database with `\c cs348`. There will currently be no relations (you can see by using `\dt`).
5. Create the (currently test) table as follows: `CREATE TABLE test (id SERIAL PRIMARY KEY, content TEXT NOT NULL);`.
6. Populate the table with `INSERT INTO test (content) VALUES ('hello');` `INSERT INTO test (content) VALUES ('world');` and test with `SELECT * FROM test;`.
7. You have now finished setting up the database. 
Note: Use `\conninfo` to see information about your database (it was useful for generating the DATABASE_URL)

### Backend (Node/Express)
1. Navigate to `/server`, initialize Node with`npm init`, and install the required libraries with `npm i express pg cors dotenv`
2. Create a `.env` file in `/server` with the contents `DB_USER="(your postgres user)"` and `DB_PASSWORD="(your postgres password)"` in `/server`.
3. You have now finished setting up the backend. Verify that it works by running it with `node index.js` and going to http://localhost:8080/users.

### Frontend (React)
1. Navigate to `/client` and use `npm install`.
2. You have now finished setting up the frontend (and the app). Verify that it works by running it with `npm start` and going to http://localhost:3000.

## Citations
Tutorials used:
* Table creation: https://www.educba.com/postgresql-list-tables/
* Connecting backend to database: https://dev.to/miku86/nodejs-postgresql-how-to-connect-our-database-to-our-simple-express-server-without-an-orm-10o0
* Connecting frontend to backend: https://rapidapi.com/blog/create-react-app-express/

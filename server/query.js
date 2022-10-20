const database = require('./database');

create_queries = [ // see create_tables.sql
    "CREATE TYPE usertype AS ENUM ('student', 'faculty', 'admin')",
    'CREATE TABLE "User" (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, type USERTYPE)',
    "CREATE TABLE Course (id SERIAL PRIMARY KEY, name TEXT NOT NULL)",
    'CREATE TABLE Teaches (course_id INT, staff_id INT, FOREIGN KEY (course_id) REFERENCES Course(id), FOREIGN KEY (staff_id) REFERENCES "User"(id))',
    'CREATE TABLE EnrolledIn (course_id INT, student_id INT, FOREIGN KEY (course_id) REFERENCES Course(id), FOREIGN KEY (student_id) REFERENCES "User"(id))',
    'CREATE TABLE Assignment (course_id INT, name TEXT NOT NULL, deadline TIMESTAMP, max_grade INT CHECK (max_grade >= 0), FOREIGN KEY (course_id) REFERENCES Course(id), PRIMARY KEY (course_id, name))',
    'CREATE TABLE Question (course_id INT, assignment_name TEXT NOT NULL, number INT, max_grade INT CHECK (max_grade >= 0), description TEXT, FOREIGN KEY (course_id, assignment_name) REFERENCES Assignment(course_id, name), PRIMARY KEY (course_id, assignment_name, number))',
    'CREATE TABLE QuestionSubmission (student_id INT, course_id INT, assignment_name TEXT NOT NULL, question_number INT, file_path TEXT DEFAULT \'\', grade INT CHECK (grade >= 0), staff_comments TEXT DEFAULT \'\', FOREIGN KEY (student_id) REFERENCES "User"(id), FOREIGN KEY (course_id, assignment_name, question_number) REFERENCES Question(course_id, assignment_name, number), PRIMARY KEY (student_id, course_id, assignment_name, question_number))',
    'CREATE TABLE AssignmentSubmission (student_id INT, course_id INT, assignment_name TEXT NOT NULL, grade INT, is_submitted BOOLEAN, FOREIGN KEY (student_id) REFERENCES "User"(id), FOREIGN KEY (course_id, assignment_name) REFERENCES Assignment(course_id, name))'
]

drop_queries = [
    'DROP SCHEMA public CASCADE;',
    'CREATE SCHEMA public;',
    'GRANT ALL ON SCHEMA public TO postgres;',
    'GRANT ALL ON SCHEMA public TO public;'
]

populate_queries = [ // see populate_tables.sql
    `COPY "User" (name, email, password_hash, type) FROM '${process.env.CSV_PATH}user.csv' DELIMITER ',' CSV HEADER`,
    `COPY Course (name) FROM '${process.env.CSV_PATH}course.csv' DELIMITER ',' CSV HEADER`,
    `COPY Teaches (course_id, staff_id) FROM '${process.env.CSV_PATH}teaches.csv' DELIMITER ',' CSV HEADER`,
    `COPY EnrolledIn (course_id, student_id) FROM '${process.env.CSV_PATH}enrolledin.csv' DELIMITER ',' CSV HEADER`,
    `COPY Assignment (course_id, name, deadline, max_grade) FROM '${process.env.CSV_PATH}assignment.csv' DELIMITER ',' CSV HEADER`,
    `COPY Question (course_id, assignment_name, number, max_grade, description) FROM '${process.env.CSV_PATH}question.csv' DELIMITER ',' CSV HEADER`,
    `COPY QuestionSubmission (student_id, course_id, assignment_name, question_number, file_path, grade, staff_comments) FROM '${process.env.CSV_PATH}question_submission.csv' DELIMITER ',' CSV HEADER`,
    `COPY AssignmentSubmission (student_id, course_id, assignment_name, grade, is_submitted) FROM '${process.env.CSV_PATH}assignment_submission.csv' DELIMITER ',' CSV HEADER`    
]

async function multiQuery(req, res, query_array) {
    data = {}
    try {
        for (let i = 0; i < query_array.length; i++) {
            let { rows } = await database.query(query_array[i]);
            data[i + ''] = { rows }
        }
        return res.json({data})
    } catch (error) {
        console.log(`Error: ${error}`);
        return res.send(error);
    }
}

async function query(req, res, query_string) {
    try {
        const { rows } = await database.query(query_string);
        return res.json({ rows });
    } catch (error) {
        console.log(`Error: ${error}`);
        return res.send(error);
    }
}

const Query = {
    async createTables(req, res) {
        await multiQuery(req, res, create_queries);
    },
    async dropTables(req, res) {
        await multiQuery(req, res, drop_queries);
    },
    async populateTables(req, res) {
        await multiQuery(req, res, populate_queries);
    },
    async readAll(req, res, table) {
        await query(req, res, `SELECT * FROM ${table}`);    
    },
    async columns(req, res, table) {
        await query(req, res, `SELECT column_name FROM information_schema.columns WHERE table_name='${table}' AND table_catalog='cs348' order by ordinal_position`);
    },
    async register(req, res, body) { // TODO: hash the password properly
        await query(req, res, `INSERT INTO "User" (name, email, password_hash, type) VALUES ('${body.name}', '${body.email}', '${body.password}', '${body.type}')`)
    },
    async login(req, res, email, pw) {
        await query(req, res, `SELECT * FROM "User" WHERE email='${email}' AND password_hash='${pw}'`)
    },
    async getUser(req, res, id) {
        await query(req, res, `SELECT * FROM "User" WHERE id='${id}'`)
    },
    async getCourses(req, res, id) {
        await query(req, res, `SELECT * FROM course WHERE id IN (SELECT course_id FROM enrolledin WHERE student_id=${id})`)
    },
    async run(req, res, q) {
        await query(req, res, q);
    }

};

module.exports = Query;
const database = require('./database');

create_queries = [
    "CREATE TYPE usertype AS ENUM ('student', 'faculty', 'admin')",
    'CREATE TABLE "User" (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, displayname TEXT NOT NULL, type USERTYPE)',
    "CREATE TABLE Course (id SERIAL PRIMARY KEY, name TEXT NOT NULL)",
    'CREATE TABLE Teaches (course_id INT, staff_id INT, FOREIGN KEY (course_id) REFERENCES course(id), FOREIGN KEY (staff_id) REFERENCES "User"(id))',
    'CREATE TABLE EnrolledIn (user_id INT, course_id INT, FOREIGN KEY (user_id) REFERENCES "User"(id), FOREIGN KEY (course_id) REFERENCES Course(id))',
    'CREATE TABLE Assignment (id SERIAL PRIMARY KEY, course_id INT, name TEXT NOT NULL, deadline DATE, max_grade INT CHECK (max_grade >= 0), FOREIGN KEY (course_id) REFERENCES Course(id))',
    'CREATE TABLE Question (assignment_id INT, num INT, description TEXT, max_grade INT CHECK (max_grade >= 0), FOREIGN KEY (assignment_id) REFERENCES Assignment(id), PRIMARY KEY (assignment_id, num))',
    'CREATE TABLE File (id SERIAL PRIMARY KEY, fname TEXT, fpath TEXT)',
    'CREATE TABLE QuestionSubmission (user_id INT, assignment_id INT, num INT, file_id INT DEFAULT NULL, grade INT CHECK (grade >= 0), comments TEXT DEFAULT \'\', FOREIGN KEY (user_id) REFERENCES "User"(id), FOREIGN KEY (assignment_id, num) REFERENCES Question(assignment_id, num), FOREIGN KEY (file_id) REFERENCES File(id))',
    'CREATE TABLE AssignmentSubmission (user_id INT, assignment_id INT, grade INT, is_submitted BOOLEAN, FOREIGN KEY (user_id) REFERENCES "User"(id), FOREIGN KEY (assignment_id) REFERENCES Assignment(id))'
]

drop_queries = [
    'DROP SCHEMA public CASCADE;',
    'CREATE SCHEMA public;',
    'GRANT ALL ON SCHEMA public TO postgres;',
    'GRANT ALL ON SCHEMA public TO public;'
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
    async readAll(req, res) {
        await query(req, res, "SELECT * FROM test");    
    },
    async columns(req, res) {
        await query(req, res, "SELECT * FROM information_schema.columns WHERE table_name='test' AND table_catalog='cs348'");
    },
    async add(req, res, text) {
        await query(req, res, `INSERT INTO test (content) VALUES ('${text}')`);
    },
    async deleteAll(req, res) {
        console.log("goodbye cruel world");
        await query(req, res, "DELETE FROM test");
    }
};

module.exports = Query;
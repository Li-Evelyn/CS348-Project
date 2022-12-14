const db = require('./database');

create_queries = [ // see create_tables.sql
    "CREATE TYPE usertype AS ENUM ('student', 'staff', 'admin')",
    'CREATE TABLE "User" (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, type USERTYPE)',
    "CREATE TABLE Course (id SERIAL PRIMARY KEY, name TEXT NOT NULL)",
    'CREATE TABLE Teaches (course_id INT, staff_id INT, FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE, FOREIGN KEY (staff_id) REFERENCES "User"(id) ON DELETE CASCADE)',
    'CREATE TABLE EnrolledIn (course_id INT, student_id INT, FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE, FOREIGN KEY (student_id) REFERENCES "User"(id) ON DELETE CASCADE, UNIQUE(student_id, course_id))',
    'CREATE TABLE Assignment (id SERIAL PRIMARY KEY, course_id INT, name TEXT NOT NULL, deadline TIMESTAMP, max_grade INT CHECK (max_grade >= 0), description TEXT DEFAULT \'\', UNIQUE (course_id, name), FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE)',
    'CREATE TABLE Question (assignment_id INT NOT NULL, number INT, max_grade INT CHECK (max_grade >= 0), description TEXT, FOREIGN KEY (assignment_id) REFERENCES Assignment(id) ON DELETE CASCADE, PRIMARY KEY (assignment_id, number))',
    'CREATE TABLE QuestionSubmission (student_id INT, assignment_id INT NOT NULL, question_number INT, file_path TEXT DEFAULT \'\', grade INT CHECK (grade >= 0), staff_comments TEXT DEFAULT \'\', FOREIGN KEY (student_id) REFERENCES "User"(id) ON DELETE CASCADE, FOREIGN KEY (assignment_id, question_number) REFERENCES Question(assignment_id, number) ON DELETE CASCADE, PRIMARY KEY (student_id, assignment_id, question_number))',
    'CREATE TABLE AssignmentSubmission (student_id INT, assignment_id INT NOT NULL, grade INT, is_submitted BOOLEAN, FOREIGN KEY (student_id) REFERENCES "User"(id) ON DELETE CASCADE, FOREIGN KEY (assignment_id) REFERENCES Assignment(id) ON DELETE CASCADE, PRIMARY KEY(assignment_id, student_id))'
]

drop_queries = [
    'DROP SCHEMA public CASCADE;',
    'CREATE SCHEMA public;',
    'GRANT ALL ON SCHEMA public TO postgres;',
    'GRANT ALL ON SCHEMA public TO public;'
];

populate_queries = [ // see populate_tables.sql
    `COPY "User" (name, email, password_hash, type) FROM '${process.env.CSV_PATH}user.csv' DELIMITER ',' CSV HEADER`,
    `COPY Course (name) FROM '${process.env.CSV_PATH}course.csv' DELIMITER ',' CSV HEADER`,
    `COPY Teaches (course_id, staff_id) FROM '${process.env.CSV_PATH}teaches.csv' DELIMITER ',' CSV HEADER`,
    `COPY EnrolledIn (course_id, student_id) FROM '${process.env.CSV_PATH}enrolledin.csv' DELIMITER ',' CSV HEADER`,
    `COPY Assignment (course_id, name, deadline, max_grade, description) FROM '${process.env.CSV_PATH}assignment.csv' DELIMITER ',' CSV HEADER`,
    `COPY Question (assignment_id, number, max_grade, description) FROM '${process.env.CSV_PATH}question.csv' DELIMITER ',' CSV HEADER`,
    `COPY QuestionSubmission (student_id, assignment_id, question_number, file_path, grade, staff_comments) FROM '${process.env.CSV_PATH}question_submission.csv' DELIMITER ',' CSV HEADER`,
    `COPY AssignmentSubmission (student_id, assignment_id, grade, is_submitted) FROM '${process.env.CSV_PATH}assignment_submission.csv' DELIMITER ',' CSV HEADER`
]

async function multiQuery(req, res, query_array, { has_args = false, concurrent = false } = {} ) {
	// assumes query array is in the form of [[query, args],...]
    data = {}
    try {
		let rows = [];

		if (concurrent) {
			rows = await Promise.all(query_array.map(query => has_args ? db.query(query[0], query[1]) : db.query(query)));
		}

        for (let i = 0; i < query_array.length; i++) {
			if (!concurrent) {
				let cur_query = query_array[i];
				let res = has_args ? db.query(cur_query[0], cur_query[1]) : db.query(cur_query);
				
				rows.push(await res)
			}
			
            data[i + ''] = rows[i].rows;
        }
        return res.json({data});
    } catch (error) {
        console.log(`Error: ${error.stack}`);
        return res.send(error);
    }
}

async function query(req, res, query_string, args) {
	// args needs to be in an array
    try {
        const { rows } = await db.query(query_string, args);
        return res.json({ rows });
    } catch (error) {
        console.log(`Error: ${error.stack}`);
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
    async resetTables(req, res) {
        let combined_queries = [].concat(drop_queries, create_queries, populate_queries);
        await multiQuery(req, res, combined_queries);
    },
    async readAll(req, res, table) {
        await query(req, res, `SELECT * FROM ${table}`);
    },
    async columns(req, res, table) {
        await query(req, res, 'SELECT column_name FROM information_schema.columns WHERE table_name=$1 AND table_catalog=\'cs348\' order by ordinal_position', [table]);
    },
    async register(req, res, body) { // TODO: hash the password properly
        await query(req, res, 'INSERT INTO "User" (name, email, password_hash, type) VALUES ($1, $2, $3, $4)', [body.name, body.email, body.password, body.type])
    },
    async login(req, res, email, pw) {
        await query(req, res, 'SELECT * FROM "User" WHERE email=$1 AND password_hash=$2', [email, pw])
    },
    async getUser(req, res, id) {
        await query(req, res, 'SELECT * FROM "User" WHERE id=$1', [id])
    },
    async getAllUsers(req, res) {
        await query(req, res, 'SELECT * FROM "User"', [])
    },
    async getUsersInCourse(req, res, cid) {
        await query(req, res, 'SELECT student_id FROM enrolledin WHERE course_id=$1', [cid])
    },    
    async getCourse(req, res, id) {
        await query(req, res, 'SELECT * FROM course WHERE id=$1', [id])
    },
    async getCourses(req, res, id, userType) {
        if (userType === "student") {
            await query(req, res, 'SELECT * FROM course WHERE id IN (SELECT course_id FROM enrolledin WHERE student_id=$1)', [id])
        }
        else if (userType === "staff") {
            await query(req, res, 'SELECT * FROM course WHERE id IN (SELECT course_id FROM teaches WHERE staff_id=$1)', [id])
        }
    },
    async getCourseStudents(req, res, id) {
        await query(req, res, 'SELECT * FROM "User" WHERE id IN (SELECT student_id FROM enrolledin WHERE course_id=$1)', [id])
    },
    async enrollStudent(req, res, cid, uid) {
        await query(req, res, 'INSERT INTO enrolledin values ($1, $2)', [cid, uid])
    },
    async getAssignments(req, res, id) {
        await query(req, res, 'SELECT * FROM assignment WHERE course_id=$1', [id])
    },
    async getAssignment(req, res, id) {
        await query(req, res, 'SELECT * FROM assignment WHERE id=$1', [id])
    },
    async getMaxAssignmentId(req, res) {
        await query(req, res, 'SELECT MAX(id) FROM assignment', [])
    },
    async getQuestions(req, res, aid) {
        await query(req, res, 'SELECT * FROM question WHERE assignment_id=$1', [aid])
    },
    async getAssignmentSubmission(req, res, id, aid) {
        await query(req, res, "SELECT * FROM assignmentsubmission WHERE student_id=$1 AND assignment_id=$2", [id, aid])
    },
    async getAssignmentSubmissions(req, res, id) {
        await query(req, res, "SELECT * FROM assignmentsubmission WHERE student_id=$1", [id])
    },
    async createAssignmentSubmission(req, res, uid, aid) {
        await query(req, res, 'INSERT INTO assignmentsubmission (student_id, assignment_id, is_submitted) values($1, $2, FALSE)', [uid, aid])
    },
    async getSubmissionInfoFromAssignment(req, res, aid) {
        await query(req, res, 'SELECT "User".id, "User".name, "User".email, assignmentsubmission.grade, assignmentsubmission.is_submitted FROM assignmentsubmission INNER JOIN "User" ON assignmentsubmission.student_id="User".id WHERE assignmentsubmission.assignment_id=$1', [aid])
    },
    async unEnroll(req, res, uid, cid) {
        await query(req, res, 'DELETE FROM enrolledin WHERE student_id=$1 AND course_id=$2', [uid, cid])
    },

    async enrollInto(req, res, uid, cid) {
        await query(req, res, 'INSERT INTO enrolledin (course_id, student_id) VALUES($1, $2)', [cid, uid])
    },

    async deleteCourse(req, res, cid) {
        await query(req, res,`DELETE FROM course WHERE id=$1`, [cid])
    }, 
    async createAssignment(req, res, aid, cid, a_name, deadline, max_grade, description) {
        await query(req, res, `INSERT INTO assignment values($1, $2, $3, $4, $5, $6)`, [aid, cid, a_name, deadline, max_grade, description])
    }, 
    async deleteAssignment(req, res, aid) {
        await query(req, res, `DELETE FROM assignment WHERE id=$1`, [aid])
    }, 
    async createQuestion(req, res, aid, num, max_grade, description) {
        await query(req, res, `INSERT INTO question values($1, $2, $3, $4)`, [aid, num, max_grade, description])
    }, 
    async getAssignmentStats(req, res, aid, max_grade) {
        await query(req, res, `SELECT COUNT(*) AS total_count, COUNT(grade) AS graded_count, AVG(grade*100.0/$2) AS avg, STDDEV_SAMP(grade*100.0/$2) AS std FROM AssignmentSubmission WHERE assignment_id=$1;`, [aid, max_grade])
    },
    async getAssignmentDistribution(req, res, aid, max_grade) {
        await query(req, res, `SELECT COUNT(grade) AS count, FLOOR(grade*10.0/$2)*10 AS grade_range FROM AssignmentSubmission WHERE assignment_id=$1 AND grade IS NOT NULL GROUP BY grade_range ORDER BY grade_range ASC;`, [aid, max_grade])
        // await query(req, res, `(SELECT COUNT(grade) AS count, FLOOR(grade*10.0/$2)*10 AS grade_range FROM AssignmentSubmission WHERE assignment_id=$1 AND grade IS NOT NULL GROUP BY grade_range) UNION ALL (SELECT COUNT(*) AS count, 0 AS grade_range FROM AssignmentSubmission WHERE assignment_id=$1 AND grade IS NULL);`, [aid, max_grade])
    },
    async getAssignmentNotGraded(req, res, aid) {
        await query(req, res, `SELECT * FROM AssignmentSubmission WHERE assignment_id=$1 AND grade IS NULL AND is_submitted;`, [aid])
    },
    async run(req, res, q) {
        await query(req, res, q);
    },
    async submitAssignment(req, res, uid, aid, info) {
        let submitQueries = [['UPDATE assignmentsubmission SET is_submitted=TRUE WHERE student_id=$1 AND assignment_id=$2', [uid, aid]]]
        for (let i = 0; i < info.length; i++) {
            submitQueries.push(['INSERT INTO questionsubmission (student_id, assignment_id, question_number, file_path) VALUES ($1, $2, $3, $4) ON CONFLICT (student_id, assignment_id, question_number) DO UPDATE SET file_path=$4', [info[i].uid, info[i].aid, info[i].qnum, info[i].file_path]])
        }
        await multiQuery(req, res, submitQueries, {has_args: true})
    },
    async getQuestionSubmissions(req, res, uid, aid) {
        await query(req, res, "SELECT * FROM questionsubmission WHERE student_id=$1 AND assignment_id=$2", [uid, aid])
    },
    async submitGrades(req, res, uid, aid, qdata) {
        let submitQueries = [['UPDATE assignmentsubmission SET grade=$1 WHERE student_id=$2 AND assignment_id=$3', [qdata["assn_grade"], uid, aid]]]
        let items = Object.entries(qdata)
        for (let i = 0; i < items.length; i++) {
            let entry = items[i]
            if (!isNaN(entry[0])) { // not the assignment grade
                submitQueries.push([
                    'INSERT INTO questionsubmission (student_id, assignment_id, question_number, grade, staff_comments) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (student_id, assignment_id, question_number) DO UPDATE SET grade=$4,staff_comments=$5', 
                    [uid, aid, entry[0], entry[1].grade, entry[1].staff_comments]
                ])
            }
        }
        await multiQuery(req, res, submitQueries, {has_args: true})
    }
};

module.exports = Query;
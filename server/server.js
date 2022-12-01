require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const User = require("./query");
const Query = require('./query');
const app = express();
const PORT = 8080;
const { hashPassword } = require('./hash');
// const queryMap = {
//     "all": Query.readAll,
//     "columns": Query.columns
// }

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json("hello world :)");
});

// app.get("/query/:option", (req, res) => {
//     console.log(req.params.option)
//     res.json(queryMap[req.params.option])
// });
app.get("/query/create", Query.createTables);
app.get("/query/drop", Query.dropTables);
app.get("/query/populate", Query.populateTables);
app.get("/query/reset", Query.resetTables);
app.get("/query/all", (req, res) => {
    Query.readAll(req, res, req.query.table);
});
app.get("/query/columns", (req, res) => {
    t = req.query.table == '"User"' ? 'User' : req.query.table.toLowerCase();
    Query.columns(req, res, t);
});

app.get("/login", (req, res) => {
    Query.login(req, res, req.query.email, hashPassword(req.query.pw));
})

app.post("/register", (req, res) => {
    Query.register(req, res, {
		name: req.body.name,
		email: req.body.email,
		password: hashPassword(req.body.password),
		type: req.body.type,
	})
})

app.get("/user", (req, res) => {
    Query.getUser(req, res, req.query.id);
})

app.get("/usersInCourse", (req, res) => {
    Query.getUsersInCourse(req, res, req.query.cid);
})

app.get("/course", (req, res) => {
    Query.getCourses(req, res, req.query.cid);
})

app.get("/courses", (req, res) => {
    Query.getCourses(req, res, req.query.uid, req.query.userType);
})

app.get("/coursestudents", (req, res) => {
    Query.getCourseStudents(req, res, req.query.cid);
})

app.get("/assignment", (req, res) => {
    Query.getAssignment(req, res, req.query.id)
})

app.get("/assignments", (req, res) => {
    Query.getAssignments(req, res, req.query.cid)
})

app.get("/max_aid", (req, res) => {
    Query.getMaxAssignmentId(req, res)
})

app.get("/createQuestion", (req, res) => {
    Query.createQuestion(req, res, req.query.aid, req.query.num, req.query.max_grade, req.query.description);
})

app.get("/questions", (req, res) => {
    Query.getQuestions(req, res, req.query.aid)
})

app.get("/createQuestionSubmission", (req, res) => {
    Query.createQuestionSubmission(req, res, req.query.uid, req.query.aid, req.query.num)
})

app.get("/assignmentsubmissions", (req, res) => {
    Query.getAssignmentSubmissions(req, res, req.query.uid)
})

app.get("/createAssignmentSubmission", (req, res) => {
    Query.createAssignmentSubmission(req, res, req.query.uid, req.query.aid)
})

app.get("/submissioninfofromassignment", (req, res) => {
    Query.getSubmissionInfoFromAssignment(req, res, req.query.aid)
})

app.get("/submissioninfofromuser", (req, res) => {
    Query.getSubmissionInfoFromUser(req, res, req.query.uid)
})

app.get("/assignmentstats", (req, res) => {
    Query.getAssignmentStats(req, res, req.query.aid)
})

app.get("/assignmentdistribution", (req, res) => {
    Query.getAssignmentDistribution(req, res, req.query.aid)
})

app.get("/assignmentnotgraded", (req, res) => {
    Query.getAssignmentNotGraded(req, res, req.query.aid)
})

app.get("/unenroll", (req, res) => {
    Query.unEnroll(req, res, req.query.uid, req.query.course);
})

app.get("/deleteCourse", (req, res) => {
    Query.deleteCourse(req, res, req.query.course);
})

app.get("/createAssignment", (req, res) => {
    Query.createAssignment(req, res, req.query.aid, req.query.cid, req.query.a_name, req.query.deadline, req.query.max_grade, req.query.description);
})

app.get("/deleteAssignment", (req, res) => {
    Query.deleteAssignment(req, res, req.query.assignment_id);
})

app.get("/test/:query", (req, res) => {
    q = req.params.query
    Query.run(req, res, q.substring(1, q.length - 1));
})

app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}/`);
});

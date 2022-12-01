require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const User = require("./query");
const Query = require('./query');
const fs = require('fs');
const path = require('path');
const { nextTick } = require('process');
const app = express();
const PORT = 8080;
const { hashPassword } = require('./hash');

app.use(express.static("file_submissions"))
app.use(fileUpload())
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json("hello world :)");
});

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

app.get("/questions", (req, res) => {
    Query.getQuestions(req, res, req.query.aid)
})

app.get('/questionSubmissions', (req, res) => {
    Query.getQuestionSubmissions(req, res, req.query.uid, req.query.aid)
})


app.get("/assignmentsubmission", (req, res) => {
    Query.getAssignmentSubmission(req, res, req.query.uid, req.query.aid)
})

app.get("/assignmentsubmissions", (req, res) => {
    Query.getAssignmentSubmissions(req, res, req.query.uid)
})

app.get("/submissioninfofromassignment", (req, res) => {
    Query.getSubmissionInfoFromAssignment(req, res, req.query.aid)
})

app.get("/unenroll", (req, res) => {
    Query.unEnroll(req, res, req.query.uid, req.query.course);
})

app.get("/deleteCourse", (req, res) => {
    Query.deleteCourse(req, res, req.query.course);
})

app.get("/deleteAssignment", (req, res) => {
    Query.deleteAssignment(req, res, req.query.assignment_id);
})

app.get("/test/:query", (req, res) => {
    q = req.params.query
    Query.run(req, res, q.substring(1, q.length - 1));
})

app.post('/upload', (req, res) => {
    if (req.files) {
        const files = Object.entries(req.files)
        const info = []
        let uid = req.query.uid;
        let aid = req.query.aid;
        for (const [key, value] of files) {
            let s = key.split("-")
            let uid = s[0]
            let aid = s[1]
            let qnum = s[2]
            fs.mkdirSync(`${__dirname}/file_submissions/u${uid}/a${aid}`, {recursive: true}, (err) => {
                if (err) throw err;
            })
            value.mv(`${__dirname}/file_submissions/u${uid}/a${aid}/q${qnum}.png`, (err) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send({ msg: "Error occurred"})
                }
            })
            info.push({uid: uid, aid: aid, qnum: qnum, file_path:`/u${uid}/a${aid}/q${qnum}`})
        }
        console.log("got here")
        Query.submitAssignment(req, res, uid, aid, info);
    } else {
        console.log("No files submitted")
    }
})

app.get('/download', (req, res) => {
    res.sendFile(`file_submissions/${req.query.path}.png`, {root: path.join(__dirname)}, function (err) {
        if (err) throw err;
    })
})

app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}/`);
});

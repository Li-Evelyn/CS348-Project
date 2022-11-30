require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const User = require("./query");
const Query = require('./query');
const fs = require('fs')
const app = express();
const PORT = 8080;
// const queryMap = {
//     "all": Query.readAll,
//     "columns": Query.columns
// }

app.use(express.static("file_submissions"))
app.use(fileUpload())
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
    Query.login(req, res, req.query.email, req.query.pw);
})

app.post("/register", (req, res) => {
    Query.register(req, res, req.body)
})

app.get("/user", (req, res) => {
    Query.getUser(req, res, req.query.id);
})

app.get("/courses", (req, res) => {
    Query.getCourses(req, res, req.query.uid, req.query.userType);
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

app.get("/assignmentsubmissions", (req, res) => {
    Query.getAssignmentSubmissions(req, res, req.query.uid)
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
        value.mv(`${__dirname}/file_submissions/u${uid}/a${aid}/q${qnum}`, (err) => {
            if (err) {
                console.log(err)
                return res.status(500).send({ msg: "Error occurred"})
            }
        })
        info.push({uid: uid, aid: aid, qnum: qnum, file_path:`/u${uid}/a${aid}/q${qnum}`})
    }
    Query.submitAssignment(req, res, uid, aid, info);
})

app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}/`);
});

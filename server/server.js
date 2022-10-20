require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const User = require("./query");
const Query = require('./query');
const app = express();
const PORT = 8080;
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
    Query.getCourses(req, res, req.query.uid);
})

app.get("/unenroll", (req, res) => {
    Query.unEnroll(req, res, req.query.uid, req.query.course);
})

app.get("/test/:query", (req, res) => {
    q = req.params.query
    Query.run(req, res, q.substring(1, q.length - 1));
})

app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}/`);
});

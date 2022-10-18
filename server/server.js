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
app.get("/query/all", Query.readAll);
app.get("/query/columns", Query.columns);
app.post("/", (req, res) => {
    Query.add(req, res, req.body.content);
});
app.post("/delete", Query.deleteAll);

app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}/`);
});

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const User = require("./user");
const app = express();
const PORT = 8080;
app.use(cors())

app.get("/", (req, res) => {
    res.json("hello world :)");
});

app.get("/users", User.readAll);

app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}/`);
});

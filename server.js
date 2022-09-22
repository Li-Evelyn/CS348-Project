const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { prepareValue } = require("pg/lib/utils");

const app = express();

var corsOptions = {
    origin: "http://localhost:8069"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", (req, res) => {
    res.json({message: "Welcome to our application :)"});
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}.`);
});


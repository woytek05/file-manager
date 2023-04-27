const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const fsPromises = require("fs").promises;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.engine(
    "hbs",
    hbs({
        defaultLayout: "main.hbs",
        extname: ".hbs",
        partialsDir: "views/partials",
        helpers: require("./handlebarsHelpers"),
    })
);
app.set("view engine", "hbs");

app.get("/", function (req, res) {
    res.render("index.hbs", {});
});

app.get("/newFolder", function (req, res) {
    res.render("index.hbs", { action: "New Folder" });
});

app.get("/newTextFile", function (req, res) {
    res.render("index.hbs", { action: "New Text File" });
});

app.use(express.static("static"));

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT);
});

const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const fsPromises = require("fs").promises;
const formidable = require("formidable");
const functions = require("./functions");
const CONSTANTS = require("./constants");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
    functions
        .getContentsOfUpload()
        .then((data) => res.render("index.hbs", { storage: data }));
});

app.post("/handleUpload", (req, res) => {
    res.header("Content-Type", "application/json");
    const form = formidable({});
    form.keepExtensions = true;
    form.uploadDir = CONSTANTS.UPLOAD_PATH;

    form.on("file", function (field, file) {
        fsPromises.rename(file.path, form.uploadDir + "/" + file.name);
    });

    form.on("error", function (err) {
        console.log("An error has occured with form upload");
        console.log(err);
    });

    form.on("aborted", function (err) {
        console.log("User aborted upload");
    });

    form.parse(req, (err, fields, files) => {
        console.log("----- Przesłane pola z formularza ------");
        console.log(fields);
        console.log("----- Przesłane formularzem pliki ------");
        console.log(files);
    });
});

app.post("/createNewFolder", (req, res) => {
    const folderPath = path.join(
        CONSTANTS.UPLOAD_PATH,
        req.body.newElementName
    );

    functions
        .checkIfPathExists(folderPath)
        .then((exists) => {
            if (!exists) {
                functions.createNewFolder(folderPath);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    res.redirect("/");
});

app.post("/createNewTextFile", (req, res) => {
    const filePath = path.join(CONSTANTS.UPLOAD_PATH, req.body.newElementName);

    functions
        .checkIfPathExists(filePath)
        .then((exists) => {
            if (!exists) {
                functions.createNewTextFile(filePath);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    res.redirect("/");
});

app.use(express.static("static"));

app.listen(CONSTANTS.PORT, function () {
    console.log("Start serwera na porcie " + CONSTANTS.PORT);
});

const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const fsPromises = require("fs").promises;
const formidable = require("formidable");

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

const PORT = 3000;
const UPLOAD_PATH = path.join(__dirname, "upload");

const getContentsOfUpload = async () => {
    let array = [];
    try {
        const data = await fsPromises.readdir(UPLOAD_PATH);

        for (let i = 0; i < data.length; i++) {
            const stat = await fsPromises.lstat(
                path.join(UPLOAD_PATH, data[i])
            );

            if (stat.isDirectory()) {
                array.push({ type: "folder", name: data[i] });
            } else {
                array.push({ type: "file", name: data[i] });
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        array.sort((a, b) => {
            if (
                (a.type === "folder" && b.type === "folder") ||
                (a.type === "file" && b.type === "file")
            ) {
                if (a.name > b.name) {
                    return 1;
                } else {
                    return -1;
                }
            } else if (a.type === "file" && b.type === "folder") {
                return 1;
            } else if (a.type === "folder" && b.type === "file") {
                return -1;
            }
        });
        return array;
    }
};

app.get("/", function (req, res) {
    getContentsOfUpload().then((data) =>
        res.render("index.hbs", { storage: data })
    );
});

app.post("/handleUpload", function (req, res) {
    res.header("Content-Type", "application/json");
    let form = formidable({});
    form.keepExtensions = true;
    form.uploadDir = UPLOAD_PATH;

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

app.use(express.static("static"));

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT);
});

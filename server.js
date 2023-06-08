const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const fsPromises = require("fs").promises;
const formidable = require("formidable");
const cookieParser = require("cookie-parser");
const noCache = require("nocache");
const functions = require("./serverFunctions");
const CONSTANTS = require("./CONSTANTS");
const variables = require("./variables");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(noCache());

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

let root = "/";
let users = [];

// -------- Login --------

app.get("/login", (req, res) => {
    res.render("login.hbs");
});

app.post("/login", async (req, res) => {
    const login = req.body.login || "";
    const password = req.body.password || "";

    const user = users.find(
        (user) => user.login === login && user.password === password
    );

    if (user) {
        const folderPath = path.join(__dirname, "upload", user.login);
        await functions.createNewFolder(folderPath);
        functions.changeUploadPath(folderPath);
        functions.changeUserLogin(user.login);

        res.cookie("login", user.login, {
            httpOnly: true,
            maxAge: 30 * 60 * 1000,
        }); // 30 minutes

        res.redirect("/");
    } else {
        res.render("error.hbs", {
            errorText: "Login or password isn't correct.",
            goBackUrl: "/login",
        });
    }
});

// -------- Register --------

app.get("/register", (req, res) => {
    res.render("register.hbs");
});

app.post("/register", (req, res) => {
    const login = req.body.login || "";
    const password1 = req.body.password1 || "";
    const password2 = req.body.password2 || "";

    if (login.length >= 3) {
        const logins = users.map((user) => user.login);
        if (!logins.includes(login)) {
            if (password1 === password2) {
                if (password1.length >= 8) {
                    const user = { login: login, password: password1 };
                    users.push(user);
                    res.render("login.hbs", { successfulRegistration: true });
                } else {
                    res.render("error.hbs", {
                        errorText:
                            "Password has to contain at least 8 characters.",
                        goBackUrl: "/register",
                    });
                }
            } else {
                res.render("error.hbs", {
                    errorText: "Passwords don't match.",
                    goBackUrl: "/register",
                });
            }
        } else {
            res.render("error.hbs", {
                errorText: "There is already a user with that login.",
                goBackUrl: "/register",
            });
        }
    } else {
        res.render("error.hbs", {
            errorText: "Login has to contain at least 3 characters.",
            goBackUrl: "/register",
        });
    }
});

// -------- Logout --------

app.get("/logout", (req, res) => {
    const login = req.cookies.login || "user";
    res.render("logout.hbs", { login: login });
});

app.post("/logout", (req, res) => {
    res.clearCookie("login");
    res.redirect("/login");
});

// -------- Error --------

app.get("/error", (req, res) => {
    res.render("error.hbs", {
        errorText: "This is a subpage for showing errors.",
        goBackUrl: "/login",
    });
});

// -------- Main Views --------

app.get("/", (req, res) => {
    if (functions.checkIfUserExists(users, req.cookies.login)) {
        const folderPath = req.query.path || "/";
        root = folderPath;
        let folderNames = folderPath.split("/").filter((el) => el !== "");
        let paths = [];
        let folders = [];

        for (let i = 0; i < folderNames.length; i++) {
            if (i === 0) {
                paths.push("/" + folderNames[i]);
            } else {
                paths.push(paths[i - 1] + "/" + folderNames[i]);
            }
        }

        folderNames.unshift("home");
        paths.unshift("/");

        for (let i = 0; i < folderNames.length; i++) {
            folders.push({ name: folderNames[i], path: paths[i] });
        }

        functions
            .checkIfPathExists(`${variables.uploadPath}/${folderPath}`)
            .then((exists) => {
                if (exists) {
                    functions
                        .getContentsOfFolder(
                            `${variables.uploadPath}/${folderPath}`
                        )
                        .then((data) =>
                            res.render("index.hbs", {
                                root: folderPath,
                                isFolder: true,
                                storage: data,
                                folders: folders,
                                userLogin: variables.userLogin,
                            })
                        );
                } else {
                    res.redirect("/");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    } else {
        res.redirect("/login");
    }
});

app.get("/showFile", (req, res) => {
    if (functions.checkIfUserExists(users, req.cookies.login)) {
        const filePath = req.query.path || "/";
        const fileExtension = `.${filePath.split(".").at(-1)}`;
        let textFile = true;

        if (CONSTANTS.IMAGE_FILE_EXTENSIONS.includes(fileExtension)) {
            textFile = false;
        }

        functions
            .checkIfPathExists(`${variables.uploadPath}/${filePath}`)
            .then((exists) => {
                if (exists) {
                    if (textFile) {
                        functions
                            .getContentsOfFile(
                                `${variables.uploadPath}/${filePath}`
                            )
                            .then((data) => {
                                if (data !== "ERROR") {
                                    res.render("editor.hbs", {
                                        root: filePath,
                                        isFolder: false,
                                        text: data,
                                        textFile: textFile,
                                        userLogin: variables.userLogin,
                                    });
                                } else {
                                    res.redirect("/");
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                res.redirect("/");
                            });
                    } else {
                        res.render("editor.hbs", {
                            root: filePath,
                            isFolder: false,
                            imagePath: filePath,
                            textFile: textFile,
                            effects: CONSTANTS.EFFECTS.map((el) => {
                                return {
                                    name: el.name,
                                    imagePath: filePath,
                                };
                            }),
                            userLogin: variables.userLogin,
                        });
                    }
                } else {
                    res.redirect("/");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    } else {
        res.redirect("/login");
    }
});

// -------- Upload --------

app.post("/handleUpload", (req, res) => {
    const form = formidable({});
    form.multiples = true;
    form.keepExtensions = true;
    form.uploadDir = variables.uploadPath;
    form.maxFileSize = 500 * 1024 * 1024;

    form.on("file", async (field, file) => {
        await functions.rename(
            file.path,
            `${form.uploadDir}${functions.getFormattedPath(root, file.name)}`
        );
    });

    form.on("error", (err) => {
        console.log("An error has occured with form upload");
        console.log(err);
    });

    form.on("aborted", (err) => {
        console.log("User aborted upload");
    });

    form.parse(req, (err, fields, files) => {
        console.log("----- Submitted fields ------");
        console.log(fields);
        console.log("----- Submitted files ------");
        console.log(files);
    });

    res.redirect(`/?path=${root}`);
});

// -------- Folders --------

app.post("/createNewFolder", (req, res) => {
    const folderPath = path.join(
        variables.uploadPath,
        req.body.root,
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

    res.redirect(`/?path=${req.body.root}`);
});

app.post("/removeFolder", (req, res) => {
    const filePath = path.join(
        variables.uploadPath,
        req.body.root,
        req.body.name
    );

    functions
        .checkIfPathExists(filePath)
        .then((exists) => {
            if (exists) {
                functions.removeFolder(filePath);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    res.redirect(`/?path=${req.body.root}`);
});

// -------- Files --------

app.get("/getFile", (req, res) => {
    const queryPath = req.query.path || "/";
    res.sendFile(path.join(variables.uploadPath, queryPath));
});

app.post("/saveFile", (req, res) => {
    const queryPath = req.body.filePath || "";
    const filePath = path.join(variables.uploadPath, queryPath);
    const text = req.body.text || "";

    console.log(text);

    functions
        .checkIfPathExists(filePath)
        .then((exists) => {
            if (exists) {
                functions.saveFile(filePath, text);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    res.redirect(`/showFile?path=${queryPath}`);
});

app.post("/createNewTextFile", (req, res) => {
    const filePath = path.join(
        variables.uploadPath,
        req.body.root,
        req.body.newElementName
    );
    const extension = req.body.extension;

    functions
        .checkIfPathExists(filePath)
        .then((exists) => {
            if (!exists) {
                functions.createNewTextFile(filePath, extension);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    res.redirect(`/?path=${req.body.root}`);
});

app.post("/removeTextFile", (req, res) => {
    const filePath = path.join(
        variables.uploadPath,
        req.body.root,
        req.body.name
    );

    functions
        .checkIfPathExists(filePath)
        .then((exists) => {
            if (exists) {
                functions.removeTextFile(filePath);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    res.redirect(`/?path=${req.body.root}`);
});

app.post("/saveImageFile", (req, res) => {
    const queryPath = req.body.filePath || "";
    const filePath = path.join(variables.uploadPath, queryPath);
    const dataUrl = req.body.dataUrl || "";

    functions
        .checkIfPathExists(filePath)
        .then((exists) => {
            if (exists) {
                functions.saveFileSync(
                    filePath,
                    Buffer.from(dataUrl.split(",")[1], "base64")
                );
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    res.redirect(`/showFile?path=${queryPath}`);
});

// -------- Folders and Files --------

app.post("/changeName", (req, res) => {
    let isFolder = true;
    if (req.body.isFolder === "true") {
        isFolder = true;
    } else if (req.body.isFolder === "false") {
        isFolder = false;
    }
    const oldFilePath = path.join(variables.uploadPath, req.body.root);
    let newFilePath = oldFilePath.split("/");
    newFilePath.pop();
    newFilePath = path.join(newFilePath.join("/"), req.body.newElementName);
    const extension = oldFilePath.split(".").at(-1);

    functions
        .checkIfPathExists(oldFilePath)
        .then(async (exists) => {
            if (exists) {
                let result = "";
                if (isFolder == true) {
                    result = await functions.rename(oldFilePath, newFilePath);
                } else {
                    result = await functions.rename(
                        oldFilePath,
                        `${newFilePath}.${extension}`
                    );
                }
                if (result === "ERROR") {
                    let redirect = oldFilePath.split(
                        `/${variables.userLogin}/`
                    );
                    redirect.shift();
                    redirect = redirect.join(`/${variables.userLogin}/`);
                    if (isFolder == true) {
                        res.redirect(`/?path=${redirect}`);
                    } else {
                        res.redirect(`/showFile?path=${redirect}.${extension}`);
                    }
                } else {
                    let redirect = newFilePath.split(
                        `/${variables.userLogin}/`
                    );
                    redirect.shift();
                    redirect = redirect.join(`/${variables.userLogin}/`);
                    root = redirect;

                    if (isFolder == true) {
                        res.redirect(`/?path=${redirect}`);
                    } else {
                        res.redirect(`/showFile?path=${redirect}.${extension}`);
                    }
                }
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});

// -------- Settings --------

app.get("/getSettings", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    functions.getContentsOfFile(`${CONSTANTS.SETTINGS_PATH}`).then((data) => {
        res.json(data);
    });
});

app.post("/saveSettings", (req, res) => {
    const queryPath = req.body.filePath || "";
    const dataTheme = req.body.dataTheme || "atom-one-dark";
    const backgroundColor = req.body.backgroundColor || "#282c34";
    const color = req.body.color || "#abb2bf";
    const fontSize = req.body.fontSize || "16px";

    const text = JSON.stringify(
        {
            dataTheme: dataTheme,
            backgroundColor: backgroundColor,
            color: color,
            fontSize: fontSize,
        },
        null,
        2
    );

    functions
        .checkIfPathExists(CONSTANTS.SETTINGS_PATH)
        .then((exists) => {
            if (exists) {
                functions.saveFile(CONSTANTS.SETTINGS_PATH, text);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    res.redirect(`/showFile?path=${queryPath}`);
});

app.use(express.static("static"));

app.listen(CONSTANTS.PORT, function () {
    console.log("Start serwera na porcie " + CONSTANTS.PORT);
});

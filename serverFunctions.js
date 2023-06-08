const fsPromises = require("fs").promises;
const fs = require("fs");
const path = require("path");
const CONSTANTS = require("./CONSTANTS");
const variables = require("./variables");

const checkIfUserExists = (users, loginCookie) => {
    if (loginCookie) {
        const user = users.find((user) => user.login === loginCookie);
        if (user) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

const checkIfPathExists = async (path) => {
    try {
        await fsPromises.access(path);
        return true;
    } catch (error) {
        return false;
    }
};

const getFormattedPath = (root, name) => {
    if (root.at(0) === "/") {
        root = root.substring(1);
    }
    let result = "";
    if (root === "" || root === "/") {
        result = `/${name}`;
    } else if (root.slice(-1) === "/") {
        result = `/${root}${name}`;
    } else {
        result = `/${root}/${name}`;
    }

    return result;
};

const getContentsOfFolder = async (folderPath) => {
    let array = [];
    try {
        const data = await fsPromises.readdir(folderPath);
        let root = folderPath.split(`/${variables.userLogin}/`);
        root.shift();
        root = root.join(`/${variables.userLogin}/`);

        for (let i = 0; i < data.length; i++) {
            const stat = await fsPromises.lstat(path.join(folderPath, data[i]));

            if (stat.isDirectory()) {
                array.push({
                    type: "folder",
                    name: data[i],
                    root: root,
                });
            } else {
                array.push({
                    type: "file",
                    extension: data[i].split(".").at(-1),
                    availableExtensions: [
                        "doc",
                        "html",
                        "css",
                        "js",
                        "json",
                        "md",
                        "txt",
                        "png",
                        "jpg",
                        "gif",
                        "pdf",
                    ],
                    name: data[i],
                    root: root,
                });
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        sortFoldersAndFiles(array);
        return array;
    }
};

const getContentsOfFile = async (path) => {
    let data = "";
    try {
        data = await fsPromises.readFile(path, "utf-8");
    } catch (error) {
        console.log(error);
        data = "ERROR";
    } finally {
        return data;
    }
};

const createNewFolder = async (folderPath) => {
    try {
        await fsPromises.mkdir(folderPath);
    } catch (error) {
        console.log(error);
    }
};

const removeFolder = async (folderPath) => {
    try {
        const data = await fsPromises.readdir(folderPath);

        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const elPath = path.join(folderPath, data[i]);
                const stat = await fsPromises.lstat(elPath);

                if (stat.isDirectory()) {
                    await removeFolder(elPath);
                } else {
                    await removeTextFile(elPath);
                }
            }
        }
        await fsPromises.rmdir(folderPath);
    } catch (error) {
        console.log(error);
    }
};

const saveFile = async (filePath, text) => {
    try {
        await fsPromises.writeFile(filePath, text);
    } catch (error) {
        console.log(error);
    }
};

const createNewTextFile = async (textFilePath, extension) => {
    try {
        let data = "";
        switch (extension) {
            case ".txt":
                data = CONSTANTS.TXT;
                break;
            case ".html":
                data = CONSTANTS.HTML;
                break;
            case ".css":
                data = CONSTANTS.CSS;
                break;
            case ".xml":
                data = CONSTANTS.XML;
                break;
            default:
                data = "";
                break;
        }
        await fsPromises.writeFile(`${textFilePath}${extension}`, data, "utf8");
    } catch (error) {
        console.log(error);
    }
};

const removeTextFile = async (filePath) => {
    try {
        await fsPromises.unlink(filePath);
    } catch (error) {
        console.log(error);
    }
};

const saveFileSync = (filePath, text) => {
    try {
        fs.writeFileSync(filePath, text);
    } catch (error) {
        console.log(error);
    }
};

const rename = async (oldPath, newPath) => {
    try {
        await fsPromises.rename(oldPath, newPath);
    } catch (error) {
        console.log(error);
        return "ERROR";
    }
};

const sortFoldersAndFiles = (array) => {
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
};

const changeUploadPath = (path) => {
    variables.uploadPath = path;
};

const changeUserLogin = (login) => {
    variables.userLogin = login;
};

module.exports = {
    checkIfUserExists,
    checkIfPathExists,
    getFormattedPath,
    getContentsOfFolder,
    getContentsOfFile,
    createNewFolder,
    removeFolder,
    saveFile,
    createNewTextFile,
    removeTextFile,
    saveFileSync,
    rename,
    changeUploadPath,
    changeUserLogin,
};

const fsPromises = require("fs").promises;
const path = require("path");
const CONSTANTS = require("./constants");

const getContentsOfUpload = async () => {
    let array = [];
    try {
        const data = await fsPromises.readdir(CONSTANTS.UPLOAD_PATH);

        for (let i = 0; i < data.length; i++) {
            const stat = await fsPromises.lstat(
                path.join(CONSTANTS.UPLOAD_PATH, data[i])
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
        sortFoldersAndFiles(array);
        return array;
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

const createNewFolder = async (folderPath) => {
    try {
        await fsPromises.mkdir(folderPath);
    } catch (error) {
        console.log(error);
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

module.exports = {
    getContentsOfUpload,
    checkIfPathExists,
    createNewFolder,
};

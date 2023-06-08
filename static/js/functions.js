let fileText = "";

function handleUpload(fileInputId) {
    const fileInput = document.getElementById(fileInputId);
    const fd = new FormData();
    for (let i = 0; i < fileInput.files.length; i++) {
        fd.append(`file${i}`, fileInput.files[i]);
    }

    const body = fd;

    fetch("/handleUpload", { method: "POST", body })
        .then((data) => {
            location.href = data.url;
        })
        .catch((error) => console.log(error));
}

function removeElement(root, type, name) {
    const data = { root: root, name: name };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    if (type === "folder") {
        fetch("/removeFolder", options)
            .then((data) => {
                location.href = data.url;
            })
            .catch((error) => console.log(error));
    } else if (type === "file") {
        fetch("/removeTextFile", options)
            .then((data) => {
                location.href = data.url;
            })
            .catch((error) => console.log(error));
    }
}

function redirect(root, type, name) {
    if (type === "folder") {
        location.href = `?path=${getFormattedPath(root, name)}`;
    } else if (type === "file") {
        location.href = `/showFile?path=${getFormattedPath(root, name)}`;
    }
}

function redirectToPath(path, fromFileEditor) {
    if (fromFileEditor) {
        path = path.split("/");
        path.pop();
        path = path.join("/");
        location.href = `/?path=${path}/`;
    } else {
        location.href = `?path=${path}`;
    }
}

function getFormattedPath(root, name) {
    let result = "";
    if (root === "" || root === "/") {
        result = `${name}`;
    } else if (root.slice(-1) === "/") {
        result = `${root}${name}`;
    } else {
        result = `${root}/${name}`;
    }

    return result;
}

function changeTheme() {
    const THEMES = [
        { name: "androidstudio", bg: "#282b2e", color: "#a9b7c6" },
        { name: "atom-one-dark", bg: "#282c34", color: "#abb2bf" },
        { name: "atom-one-light", bg: "#fafafa", color: "#383a42" },
        { name: "codepen-embed", bg: "#222", color: "#fff" },
        { name: "color-brewer", bg: "#fff", color: "#000" },
        { name: "dark", bg: "#303030", color: "#ddd" },
        { name: "default", bg: "#1d1f21", color: "#c5c8c6" },
        { name: "github-dark", bg: "#0d1117", color: "#c9d1d9" },
        { name: "github", bg: "#fff", color: "#24292e" },
        { name: "googlecode", bg: "#fff", color: "#000" },
        { name: "monokai-sublime", bg: "#23241f", color: "#f8f8f2" },
        { name: "monokai", bg: "#272822", color: "#ddd" },
        { name: "night-owl", bg: "#011627", color: "#d6deeb" },
        { name: "nord", bg: "#2e3440", color: "#d8dee9" },
        { name: "obsidian", bg: "#282b2e", color: "#e0e2e4" },
        { name: "stackoverflow-light", bg: "#f6f6f6", color: "#2f3337" },
        { name: "vs", bg: "#fff", color: "#000" },
        { name: "xcode", bg: "#fff", color: "#000" },
    ];
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];

    document.querySelectorAll("pre code").forEach((el) => {
        el.setAttribute("data-theme", randomTheme.name);
    });

    document.querySelectorAll("pre").forEach((el) => {
        el.style.color = randomTheme.color;
        el.style.backgroundColor = randomTheme.bg;
    });
}

function increaseFontSize() {
    const pre = document.querySelector("pre");
    const fontSize = pre.style.fontSize;
    const lineCountContainer = document.querySelector("#line-count");

    pre.style.fontSize = `${
        Number(fontSize.substring(0, fontSize.length - 2)) + 1
    }px`;
    lineCountContainer.style.fontSize = pre.style.fontSize;
}

function decreaseFontSize() {
    const pre = document.querySelector("pre");
    const fontSize = pre.style.fontSize;
    const lineCountContainer = document.querySelector("#line-count");

    pre.style.fontSize = `${
        Number(fontSize.substring(0, fontSize.length - 2)) - 1
    }px`;
    lineCountContainer.style.fontSize = pre.style.fontSize;
}

function previewFile(filePath) {
    location.href = `/getFile?path=${filePath}`;
}

function saveYourSettings(filePath) {
    const pre = document.querySelector("pre");
    const code = document.querySelector("pre code");

    const data = {
        filePath: filePath,
        dataTheme: code.getAttribute("data-theme"),
        backgroundColor: pre.style.backgroundColor,
        color: pre.style.color,
        fontSize: pre.style.fontSize,
    };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    fetch("/saveSettings", options)
        .then((data) => {
            location.href = data.url;
        })
        .catch((error) => console.log(error));
}

function saveFile(filePath) {
    console.log(fileText);
    const data = { filePath: filePath, text: fileText };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    fetch("/saveFile", options)
        .then((data) => {
            location.href = data.url;
        })
        .catch((error) => console.log(error));
}

function handleLineCount() {
    const lineCountContainer = document.querySelector("#line-count");
    const pre = document.querySelector("pre");
    const code = document.querySelector("pre code");

    try {
        code.innerHTML = code.innerHTML
            .replaceAll("            ", "  ")
            .replaceAll("        ", "");

        fileText = pre.innerText;
        console.log(fileText);

        pre.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && e.shiftKey) {
                e.preventDefault();
            }
        });

        pre.addEventListener("input", (e) => {
            fileText = e.target.innerText;
            console.log(fileText);
            renderLineCount(lineCountContainer, pre, e.target);
        });

        renderLineCount(lineCountContainer, pre, code);
    } catch {}
}

function renderLineCount(lineCountContainer, pre, code) {
    let arr = code.innerHTML.split(/\r\n|\r|\n|<br>/);
    let lineCount = arr.length;

    const container = document.createElement("div");
    for (let i = 0; i < lineCount; i++) {
        const div = document.createElement("div");
        div.innerText = i + 1;
        container.appendChild(div);
    }

    lineCountContainer.innerHTML = "";
    lineCountContainer.appendChild(container);
}

function applyFilter(name) {
    if (name !== "none") {
        document.getElementById("mainImage").style.filter = `${name}(100%)`;
    } else {
        document.getElementById("mainImage").style.filter = name;
    }
}

function saveImageFile(filePath) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const mainImage = document.getElementById("mainImage");
    let dataUrl = "";

    try {
        let image = new Image();
        image.src = mainImage.src;

        image.onload = () => {
            canvas.width = mainImage.offsetWidth;
            canvas.height = mainImage.offsetHeight;
            context.filter = mainImage.style.filter || "none";
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            dataUrl = canvas.toDataURL("image/jpeg");

            const data = { filePath: filePath, dataUrl: dataUrl };
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            };

            console.log(data);

            fetch("/saveImageFile", options)
                .then((data) => {
                    location.href = data.url;
                })
                .catch((error) => console.log(error));
        };
    } catch {}
}

handleLineCount();

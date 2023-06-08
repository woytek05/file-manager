import hljs from "highlight.js/lib/common";

export function setUpDialogHeader(
    dialogHeaderId,
    dialogFormId,
    newFolderContainerId,
    newTextFileContainerId,
    extensionContainerId,
    folderNameChangeContainerId
) {
    const dialogHeader = document.getElementById(dialogHeaderId);
    const dialogForm = document.getElementById(dialogFormId);
    const newFolderContainer = document.getElementById(newFolderContainerId);
    const newTextFileContainer = document.getElementById(
        newTextFileContainerId
    );
    const extensionContainer = document.getElementById(extensionContainerId);
    const folderNameChangeContainer = document.getElementById(
        folderNameChangeContainerId
    );

    try {
        newFolderContainer.addEventListener("click", () => {
            dialogHeader.innerText = "New Folder";
            dialogForm.action = "/createNewFolder";
            extensionContainer.classList.add("hidden");
        });
    } catch {}

    try {
        newTextFileContainer.addEventListener("click", () => {
            dialogHeader.innerText = "New Text File";
            dialogForm.action = "/createNewTextFile";
            extensionContainer.classList.remove("hidden");
        });
    } catch {}

    try {
        folderNameChangeContainer.addEventListener("click", () => {
            dialogHeader.innerText = "Change Name";
            dialogForm.action = "/changeName";
            extensionContainer.classList.add("hidden");
        });
    } catch {}
}

export function setUpThemeToggle(
    themeToggleId,
    themeToggleLightIconId,
    themeToggleDarkIconId
) {
    const themeToggleLightIcon = document.getElementById(
        themeToggleLightIconId
    );
    const themeToggleDarkIcon = document.getElementById(themeToggleDarkIconId);

    try {
        if (
            localStorage.getItem("color-theme") === "dark" ||
            (!("color-theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            themeToggleLightIcon.classList.remove("hidden");
        } else {
            themeToggleDarkIcon.classList.remove("hidden");
        }
    } catch {}

    const themeToggleBtn = document.getElementById(themeToggleId);

    try {
        themeToggleBtn.addEventListener("click", function () {
            themeToggleDarkIcon.classList.toggle("hidden");
            themeToggleLightIcon.classList.toggle("hidden");

            if (localStorage.getItem("color-theme")) {
                if (localStorage.getItem("color-theme") === "light") {
                    document.documentElement.classList.add("dark");
                    localStorage.setItem("color-theme", "dark");
                } else {
                    document.documentElement.classList.remove("dark");
                    localStorage.setItem("color-theme", "light");
                }
            } else {
                if (document.documentElement.classList.contains("dark")) {
                    document.documentElement.classList.remove("dark");
                    localStorage.setItem("color-theme", "light");
                } else {
                    document.documentElement.classList.add("dark");
                    localStorage.setItem("color-theme", "dark");
                }
            }
        });
    } catch {}
}

export async function handleFileEditing() {
    let settings = {};
    try {
        const response = await fetch("/getSettings");
        settings = await response.json();
        settings = JSON.parse(settings);
    } catch (err) {
        console.error(err);
    }

    const filePath = document.getElementById("file-path");
    const lineCountContainer = document.querySelector("#line-count");
    const pre = document.querySelector("pre");
    const code = document.querySelector("pre code");

    try {
        code.setAttribute("data-theme", settings.dataTheme);
        pre.style.fontSize = settings.fontSize;
        pre.style.backgroundColor = settings.backgroundColor;
        pre.style.color = settings.color;
        lineCountContainer.style.fontSize = settings.fontSize;
    } catch {}

    try {
        if (filePath.innerText.split(".").at(-1) !== "txt") {
            hljs.highlightElement(code);
        }
    } catch {}
}

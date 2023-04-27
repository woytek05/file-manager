const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

if (
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
    themeToggleLightIcon.classList.remove("hidden");
} else {
    themeToggleDarkIcon.classList.remove("hidden");
}

const themeToggleBtn = document.getElementById("theme-toggle");

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

const newFolderContainer = document.getElementById("new-folder-container");
const newTextFileContainer = document.getElementById("new-text-file-container");
const dialogActionContainer = document.getElementById(
    "dialog-action-container"
);

newFolderContainer.addEventListener("click", () => {
    dialogActionContainer.innerText = "New Folder";
});

newTextFileContainer.addEventListener("click", () => {
    dialogActionContainer.innerText = "New Text File";
});

function handleUpload(fileInput) {
    const fd = new FormData();
    fd.append("file", fileInput.files[0]);
    const body = fd;

    fetch("/handleUpload", { method: "post", body }).catch((error) =>
        console.log(error)
    );
}

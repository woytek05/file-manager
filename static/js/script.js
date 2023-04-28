import setUpThemeToggle from "./setUpThemeToggle.js";
import setUpDialogHeader from "./setUpDialogHeader.js";

setUpThemeToggle(
    "theme-toggle",
    "theme-toggle-light-icon",
    "theme-toggle-dark-icon"
);

setUpDialogHeader(
    "dialog-header",
    "new-folder-container",
    "new-text-file-container"
);

function handleUpload(fileInput) {
    const fd = new FormData();
    fd.append("file", fileInput.files[0]);
    const body = fd;

    fetch("/handleUpload", { method: "post", body }).catch((error) =>
        console.log(error)
    );
}

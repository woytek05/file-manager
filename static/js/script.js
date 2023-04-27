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

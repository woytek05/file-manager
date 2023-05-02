export default function setUpDialogHeader(
    dialogHeaderId,
    dialogFormId,
    newFolderContainerId,
    newTextFileContainerId
) {
    const dialogHeader = document.getElementById(dialogHeaderId);
    const dialogForm = document.getElementById(dialogFormId);
    const newFolderContainer = document.getElementById(newFolderContainerId);
    const newTextFileContainer = document.getElementById(
        newTextFileContainerId
    );

    newFolderContainer.addEventListener("click", () => {
        dialogHeader.innerText = "New Folder";
        dialogForm.action = "/createNewFolder";
    });

    newTextFileContainer.addEventListener("click", () => {
        dialogHeader.innerText = "New Text File";
        dialogForm.action = "/createNewTextFile";
    });
}

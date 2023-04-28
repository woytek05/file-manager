export default function setUpDialogHeader(
    dialogHeaderId,
    newFolderContainerId,
    newTextFileContainerId
) {
    const newFolderContainer = document.getElementById(newFolderContainerId);
    const newTextFileContainer = document.getElementById(
        newTextFileContainerId
    );
    const dialogHeader = document.getElementById(dialogHeaderId);

    newFolderContainer.addEventListener("click", () => {
        dialogHeader.innerText = "New Folder";
    });

    newTextFileContainer.addEventListener("click", () => {
        dialogHeader.innerText = "New Text File";
    });
}

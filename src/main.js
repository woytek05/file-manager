import "flowbite";
import "boxicons";
import "./tailwind.css";
import "./main.scss";
import {
    setUpDialogHeader,
    setUpThemeToggle,
    handleFileEditing,
} from "./functions";

setUpThemeToggle(
    "theme-toggle",
    "theme-toggle-light-icon",
    "theme-toggle-dark-icon"
);

setUpDialogHeader(
    "dialog-header",
    "dialog-form",
    "new-folder-container",
    "new-text-file-container",
    "extension",
    "folder-name-change-container"
);

handleFileEditing();

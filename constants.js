const path = require("path");

const PORT = 3000;
const UPLOAD_PATH = path.join(__dirname, "upload");
const SETTINGS_PATH = path.join(__dirname, "static", "settings.txt");
const TXT = `New Text File!
You can write there whatever you want`;
const HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  </head>
  <body></body>
</html>`;
const CSS = `.bg-red {
  background-color: red;
}`;
const XML = `<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`;
const THEMES = [
    "androidstudio",
    "atom-one-dark",
    "atom-one-light",
    "codepen-embed",
    "color-brewer",
    "dark",
    "default",
    "github-dark",
    "github",
    "googlecode",
    "monokai-sublime",
    "monokai",
    "night-owl",
    "nord",
    "obsidian",
    "stackoverflow-light",
    "vs",
    "xcode",
];
const IMAGE_FILE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".jpe",
    ".jif",
    ".jfif",
    ".jfi",
    ".png",
    ".gif",
    ".webp",
    ".tiff",
    ".tif",
];
const EFFECTS = [
    { name: "grayscale" },
    { name: "invert" },
    { name: "sepia" },
    { name: "none" },
];

module.exports = {
    PORT,
    UPLOAD_PATH,
    SETTINGS_PATH,
    TXT,
    HTML,
    CSS,
    XML,
    THEMES,
    IMAGE_FILE_EXTENSIONS,
    EFFECTS,
};

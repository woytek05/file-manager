/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.{html,js,hbs}"],
    theme: {
        extend: {},
    },
    plugins: [require("@tailwindcss/typography")],
    darkMode: "class",
};

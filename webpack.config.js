const path = require("path");

module.exports = {
    context: path.resolve(__dirname, "src"),
    entry: {
        js: "./main.js",
        css: ["./main.scss", "./tailwind.css"],
    },
    output: {
        path: path.resolve(__dirname, "./static/js"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                        {
                                            // Options
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
    stats: {
        loggingDebug: ["sass-loader"],
    },
    watch: true,
};

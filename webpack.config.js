// webpack.config.js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/sdk/chatbot.tsx",
  output: {
    filename: "chatbot-sdk.js",
    path: path.resolve(__dirname, "dist"),
    library: "Chatbot", // Expose the component globally
    libraryTarget: "umd",
    libraryExport: "default",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
          "ts-loader",
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /@smithy\/util-retry/, // The module that is causing issues
      contextRegExp: /NO_RETRY_INCREMENT/, // The specific export to ignore (if necessary)
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};

const { join } = require("path");
const APP_DIR = join(__dirname, "/src/js");
const BUILD_DIR = join(__dirname, "/dist");

module.exports = {
  entry: {
    app: join(APP_DIR, "app.js")
  },
  output: {
    path: BUILD_DIR,
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  },
  optimization: {
    minimize: true
  }
};

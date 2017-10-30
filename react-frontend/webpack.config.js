const webpack = require("webpack")
const path = require("path")

const autoprefixer = require("autoprefixer")
const cssnano = require("cssnano")

const BUILD_DIR = path.resolve(__dirname, "src/public")
const APP_DIR = path.resolve(__dirname, "src/app")

const config = {
  entry: APP_DIR + "/boot.js",
  output: {
    path: BUILD_DIR,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: APP_DIR,
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use:  [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [
                autoprefixer(),
                cssnano()
              ]
            }
          }
        ]
      }
    ]
  }
}

module.exports = config

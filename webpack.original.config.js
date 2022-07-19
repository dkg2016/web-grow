const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: "development",
  entry: '/original/main.js',
  devServer: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: "/original/index.html"
    })
  ]
}
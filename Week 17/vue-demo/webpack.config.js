const webpack = require('webpack'); //to access built-in plugins
const CopyPlugin = require('copy-webpack-plugin'); //installed via npm
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  entry:"./src/main.js",
  mode:"production",
  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.css$/, use: ['vue-style-loader','css-loader'] }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "src/*.html", to: "[name].[ext]" }
      ],
    }),
  ]
};
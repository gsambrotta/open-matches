const common = require('./common.config')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const prod = merge(common, {
  devtool: 'source-map',
  mode: 'production',
  entry: {
    App: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, '../../', 'dist'),
    // can use "substitutions" in file names like [name] and [hash]
    // name will be `App` because that is specify in entry
    filename: '[name]_bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: './index.html',
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            unused: false,
          },
        },
      }),
    ],
  },
})

module.exports = prod

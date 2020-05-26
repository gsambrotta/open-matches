const common = require('./common.config')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const prod = merge(common, {
  devtool: 'source-map',
  mode: 'production',
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

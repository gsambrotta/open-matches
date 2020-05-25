const common = require('./common.config')
const merge = require('webpack-merge')

const dev = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: '../dist',
    port: 3000,
    historyApiFallback: true,
  },
})

module.exports = dev

const common = require('./common.config')
const merge = require('webpack-merge')

const dev = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: '../dist',
    compress: true,
    port: 3000,
    historyApiFallback: true,
    hot: true,
    stats: 'minimal',
  },
})

module.exports = dev

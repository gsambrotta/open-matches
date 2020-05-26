const path = require('path')

/*
  webpack sees every file as a module.
  How to handle those files is up to loaders.
  We only have a single entry point (a .js file) and everything is required from that js file
*/
const javascript = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
  },
}

const css = {
  test: /\.css$/i,
  exclude: /node_modules/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true,
      },
    },
  ],
}

const html = {
  test: /\.html$/,
  use: [
    {
      loader: 'html-loader',
    },
  ],
}

const fonts = {
  test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
  loader: require.resolve('file-loader'),
  options: {
    name: '/static/media/[name].[hash:8].[ext]',
  },
}

const images = {
  test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
  loader: require.resolve('url-loader'),
  options: {
    limit: 10000,
    name: '/static/media/[name].[hash:8].[ext]',
  },
}

const config = {
  entry: {
    App: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, '../../', 'dist'),
    // can use "substitutions" in file names like [name] and [hash]
    // name will be `App` because that is specify in entry
    filename: '[name]_bundle.js',
  },
  module: {
    rules: [javascript, css, fonts, images, html],
  },
}

module.exports = config

const path = require('path')
const webpack = require('webpack')

const WebpackZipPlugin = require('./lib')

module.exports = {
  entry: './test/entry.js',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /(node_modules)/
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackZipPlugin({
      initialFile: 'dist',
      endPath: './weidian',
      zipName: 'weidian.zip',
      frontShell: 'ls'
    })
  ]
}

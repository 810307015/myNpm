var path = require('path')
var webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: './index.jsx', //入口文件路径
  output: {
    filename: '[name].js',
    library: 'keepAlive',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,  // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
        exclude: /node_modules/,
        loader: 'babel-loader' // 加载模块 "babel-loader" 
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
}
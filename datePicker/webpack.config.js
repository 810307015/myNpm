var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/index.js', //入口文件路径
  output: {
    filename: '[name].js',
    library: 'date-picker4mobile',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,  // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
        query: {
          plugins: [
            ["import", { libraryName: "antd-mobile", style: "css" }] //按需加载
          ]
        },
        loader: 'babel-loader' // 加载模块 "babel-loader" 
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'less-loader',
          { loader: 'less-loader', options: { javascriptEnabled: true } }
        ]
      },
      {
        test: /\.css$/,
        // include: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },

    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
}
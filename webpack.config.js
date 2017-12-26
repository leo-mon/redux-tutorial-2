const path = require('path')

const config={
  entry: './src/index.js',  // 読み込みの起点
  output: {
    path: path.resolve(__dirname, '/dist'),  // 出力ディレクトリ
    filename: 'bundle.js'  // 出力ファイル名
  },
  module: {
    rules:[
      {  // Javascript Starndard設定
        enforce: 'pre',  // 最初に実行
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'standard-loader',
          options: {
            error: false,
            snazzy: true,
            //parser: 'babel-eslint'
          }
        }
      },
      {  // Babel設定
        test: /\.js$/,  // ソースとなるファイル類(.jsと記載されたもの)
        exclude: /node_modules/,  // node_modulesは除外
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devtool: 'inline-source-map',  // デバッグ用にソースマップ追加
  devServer: {  // webpack-dev-serverの設定
    contentBase: './dist',
    port: 3000,
  }
}

module.exports = config

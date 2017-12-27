# redux tutorial part 2
https://egghead.io/courses/building-react-applications-with-idiomatic-redux

ドキュメントではセミコロンを使わない書き方をしているので[JavaScript Standard Style](https://standardjs.com/) を適用してみる

## 準備

### ライブラリ

```
yarn add\
  webpack webpack-dev-server\
  babel-loader babel-core babel-preset-env babel-preset-react babel-plugin-transform-object-rest-spread\
  standard-loader standard\
  --dev
```

```
yarn add\
  react react-dom\
  redux react-redux\
  react-router-dom\
  node-uuid lodash
```

### 設定ファイル
- `webpack.config.js`
- `.babelrc`

を適宜配置

`package.json`に
```
"scripts": {
  "start": "webpack-dev-server"
}
```
追記

### 開発サーバ起動
```
yarn start
```

### VSCode
Lintingを使うには[プラグイン](https://marketplace.visualstudio.com/items?itemName=chenxsan.vscode-standardjs)入れて`yarn add standard --dev`

## その他メモ
- babelはpreset-latestはdepricateでpreset-envを利用
- それでもオブジェクトに対してのスプレッド演算子適用はできないので[プラグイン](https://babeljs.io/docs/plugins/transform-object-rest-spread/)必要

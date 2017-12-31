## Normalizing the State shape

state tree 内のtodosはこれまでアレイだったが実際はもう少し複雑なオブジェクトだったり同期をせずに異なるアレイに同じIDで入ったりするだろう、ということでtodos.jsのリファクタ

stateはDBとして扱われるべきなので、todosをidによってインデックスされたオブジェクトとする  

reducerをまず名前変更、新しいアイテムを追加していくより、テーブルの値を変更していくようにする

`TOGGLE_TODO`も`ADD_TODO`も同じロジックを持つようにする  

byID reducerがアクションをを受け取ると、idと、現在のtodo＋アップデートされたtodoとのマッピングのコピーを返す

todos自体はbyId reducerで扱うが、idのアレイ全体についてのreducerについても作成する  
ADD_TODOだけがTODO追加でアレイの要素が増えるのでケアする必要あり

combineReducersを各階層で利用しても問題なし

> これまでアレイだったのがオブジェクトになるので一回ローカルストレージをクリアする必要あり

> configureStoreにconsole.logを仕込んで状態確認

```javascript
{
  "todos":{
    "byId":{
      "10d3f33f-0561-44f9-9c3a-6d459886ab46":{
        "id":"10d3f33f-0561-44f9-9c3a-6d459886ab46",
        "text":"hey",
        "completed":true
      },
      "6552f8fb-9c55-4ef3-87da-4b07498af7b8":{
        "id":"6552f8fb-9c55-4ef3-87da-4b07498af7b8",
        "text":"ho",
        "completed":false
      },
      "2ef3d288-42ad-4eed-945b-9fab65208ab6":{
        "id":"2ef3d288-42ad-4eed-945b-9fab65208ab6",
        "text":"lets go",
        "completed":false
      }
    },
    "allIds":["10d3f33f-0561-44f9-9c3a-6d459886ab46","6552f8fb-9c55-4ef3-87da-4b07498af7b8","2ef3d288-42ad-4eed-945b-9fab65208ab6"]
  }
}
```

> combineReducerで束ねた名称が`key`になってその下にstateが入ってくる感じになる（ので気にせず`state`として値を引っ張っていい模様）
> なぜこうしたかはきっとそのうち説明があるんだろう

## Wrapping dispatch() to Log Actions

stateの形状が複雑になってきたので、store.dispatch関数をオーバーライドしログを追加

chromeのように`console.group()`をサポートしているブラウザを念頭に`actiion.type`でグルーピング  
前段のstateをdispatch前に取得しておくことで差分をみる

`rawDispatch`と`returnValue`で生の関数を保持しておく

環境変数でproductionの時は排除(Webpackでのプラグインの設定でできる模様)

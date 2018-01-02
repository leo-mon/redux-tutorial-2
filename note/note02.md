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


##  Adding a Fake Backend to the project

フェイクAPIとのやりとりの実装（そのためlocalStorageに関するコードまわりは削除）

> 動作サンプルをindex.jsに記載


## Fetching Data on Route Change
VisibleTodoにフェイクAPIからの値取得を入れる  
値代入にライフサイクルでのフックを入れるためにclassとして宣言、propsはTodoListへ全部つっこむ

VisibleTodoListをクラスとして宣言したので同じ名前のconstは宣言できない、ので再代入によってwithRouterとconnectを入れる

> ここStandardだとエラー吐かれる、とりあえず無視して進む

filterのpropsがあると便利なのでmapStateToPropsで注入する

これをcomponentDidMount()でマウントの前に引っ掛ける

ただしこれだけだとfilterの値を変更しても反映されない、componentDidMountは最初の一回しか実行されないため

これを解消するのにcomponentDidUpdateを利用する  
componentDidUpdateはアップデート前のpropsを受け取るのでそれと比較し、違うようであればfetchTodosを走らせるようにする

> Viewにはこのタイミングで反映は入れていない


## Dispatching Actions with the Fetched Data

DidMountとDidUpdateでのコードの共通化できる部分を`fetchData`とする

取得してきたデータをStoreのstateに取り込むにはactionをdispatchするしかない（Reduxでは）  
callback prop としてreceiveTodoを用いることとする  
コンポーネント内でこれを用いるためにreceiveTodoを渡さなければならないが、それにはaction createrを作成して`connect`の第二引数に渡す

action createrはフェイクサーバーのレスポンスに加えてfilterをつけてreducerへと渡す

fetchDataではfilterをすぐに引っ張り出しておく、というのもコールバックが発火するとthis.props.filterは変化してしまうかもしれないから  

named importも修正可能、actionsと名付けて丸っとmapDispatchToPropsとして渡してしまう

TodoListについてはonTodoClickの名前でactionが渡される必要があるが、他はそのまま渡す


## Wrapping dispatch() to Recognize Promises
receiveTodosは少し不便  
fetchTodosとreceiveTodosは同じ同じ引数をとるので、ひとつのaction createrにまとめることができる  

非同期のaction creater, fetchTodosを加える  
receiveTodosが同期的にアクションオブジェクトを返却する一方でfetchTodosがPromiseを返してアクションオブジェクトを解決する

コンテナの方  
connectでactionは注入されるのでPropsから拾う

fetchTodosのAction CreaterがAPIからfetchTodoを呼んで、receiveTodoでReduxのアクションが実行　　
しかしデフォルトではReduxはPromiseを受け付けない  
オーバーライドして受け取れるようにする必要がる

actionが本物のactionなのかPromiseなのかわからないので、thenメソッドがあってそれが関数なのかチェック、あればPromiseなのでresolveされるまで待ってrawDispatchへと渡すようにする

オーバーライドの順番は重要
PromiseSupportを先に書いてしまうと、actionは最初にログを吐いた後にPromiseが解決されてしまうため、type:undefindが並んでしまう

## The Middleware Chain
`store.dispatch` は `addLoggingToDispatch`によってオーバーライドされているので、`addPromiseSupportToDispatch`内で`rawDispatch`という名前で保持しているのは正確ではないので`next`という名前にする  

> なんなのこのこだわり

合わせて  addLoggingToDispatchもnextに変更、これが一番最初にオーバーライドする関数とは限らないため？

これらのような公式の関数のオーバーライドはうまくいっているうちはいいがいい方法ではない  
middleware functionのアレイを宣言することでこのパターンをやめることができる

`wrapDispatchWithMiddlewares`を宣言、第一引数にstore、第二引数にmiddleware functions array
このarayでforeachを走らせそれぞれを実行する（store.dispatchにそれぞれのmiddlewareを走らせる）  
これらmiddleware関数にはパターンがある、store.dispatchの値を保持して、nextとした変数へと格納する  

middlewareの仕様としてnextは外部の引数として入れることができる

> このためのnextだった模様

この変更によりmiddlewareは関数を返す関数を返す関数になる  
このパターンをcurringと呼ぶ、Javascriptではあまり見かけないが関数型プログラミングではよく使われるパターン

next middlewareをstoreから取得するよりも、injectableにすることで、middlewareを呼ぶ関数がどのmiddlewareをコールするか選択できるようになる

storeだけでなくnext middlewareも注入されるようにする必要がある  
middlewareはstore.dispatchの前の値になる  

middlewareはファーストクラスのコンセプトなので、addLoggingToDispatchをlog、addPromiseSupportToDispatchをpromiseに名称変更

curried styleの関数はアロー関数のチェーンで書ける

またmiddlewareについてはdispatchのオーバーライドの順序で書いていたが、より自然にactionがmiddlewareを通る順で書けるようにreverseする


## Applying Redux Middleware

前節のように`wrapDispatchWithMiddlewares`を自前実装しつづけるのはしんどい  
代わりに`applyMiddleware`をReduxからimportする  

createStoreはmiddlewareの適用直前に呼び出せばいい  
wrapDispatchWithMiddlewaresも削除、createStore中にapplyMiddlewareを入れる

`promise`も`logger`もnpmパッケージで配布されているものを利用可能
redux-promiseとredux-loggerを追加 

applyMiddlewareをはenhancerと呼ばれる  
もしpersistStoreを入れたい場合はenhancerの前の引数に入れる

> 今更`historyApiFallback`をwebpack.config.jsへ追加、Filtering Redux State with React Router Paramsでやっておくべき設定


## Updating the State with the Fetched Data
`todos.js`中の`getVisibleTodos`は全てがメモリで動作しているという前提でインプリされていた   

これは全てのデータがサーバーから送信されてクライアントに揃っている状態でのみ動作するため、何かを取得してくるアプリケーションには適さない

 巨大なidのリストを保持するよりも、フィルタごとにidを分割して、データ取得のタイミングで埋める形にする  
state.allIdsの代わりにstate.IdsByFilterで対応するidのリストを取得する形にして、それをmapしbyIdで実際にtodosを取得する形にする

idsByFilterはallIds, activeIds, completedIdsnの3つのreducerを束ねて作る

allIdsはもともとIDのアレイとADD_TODO actionの管理を行なっていた  
サーバーから得たデータに対応させるため、ADD_TODOをRECEIVE_TODOに変更、それに対応させるためにresponseのidをそれぞれ返却するようにmap  
allIdsとactiveIs, completedIdsは別々であり、お互い完全に非依存で呼び出されるようにする

activeIdsはidのarrayであるという点では同じでが、todoがactiveなものだけ格納しておく

activeIdsもallIdsも、'RECEIVE_TODOS'が発火したら新しい状態を返してくれるが、どちらのアレイをアップデートすればい良いのかを伝える方法を作る必要がある  
RECEIVE_TODOをコールするとき一緒にfilterも渡しているのでそれを利用, completedも同様に作成

ローカルにデータはない（という体）ので、ADD_TODOもTOGGLE_TODOも削除してRECEIVE_TODOを処理するようにする

nextStateをstateの浅いコピーとして作成、その内容をresponseの内容に更新してnextStateを返す

通常代入はimmutableでないが、この場合はShallow copyした者への代入なので大丈夫

ゴミ削除

最初スイッチするときは描画に時間がかかるが、その後は瞬時に切り替わる、というのも状態がすでにキャッシュされており、背後でfetchが走っていても前後で状態が変わらないため再レンダリングが走らない


## Refactoring the Reducers
先だってvisiblityFilterを削除したため、index.jsを消去しtodo.jsをindex.jsヘリネームし昇格  

byIdを外だし（byId.js）、セレクタとしてgetTodo()を追加


IDを扱うreducer(allIds, activeIds, completedIds)は同じような形なのでcreateListを作成し共通化 　
createListも外だし
セレクタとしてgetIdを追加、これはそのうち変更

idByfilterをリネーム、listByFilterに（listとして外だししているから）

getVisibleTodosを修正、セレクタを用いてTodoを取得
アクセス用のセレクタは必ずしも必要ではないが良い方法  
これら修正によって、どのreducerのstateの形状も、あちこち変更せずによくなる
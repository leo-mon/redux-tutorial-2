## Displaying Loading Indicators

データが非同期でfetchされるときユーザーにその状態を示したい  
VisibleTodoListのrender()に追加

todosとisFetchingをpropsから取るようにする  
todosはただ一つの追加のpropなので、...を使わずダイレクトに受け取る  

mapStateToPropsによってvisibleTodosは計算されてtodosにpropsとして入っている  
これと似たことをisFetchingで行う  
getIsFetchingは現在のstateとtodosが取得しているfilterを受ける  

createList.jsにgetIsFetchingを定義し、root reducerファイル（reducers/index.js）でインポート
getIsFetchingを定義する前にstateの形状を変更する  
stateをidのアレイとするよりもオブジェクトとしstate.idに格納、state.isFetchingにローディングの状態格納  
単にidを管理するだけなのでcreateList reducerをidsと改名  
combineReducers をimportし、isFetchingを定義、これをidsとcombineReducers で束ねる  
isFetchingは最初の状態はfalseで、REQUEST_TODOSがきたらtrueに変わるようにする
REQUEST_TODOはなにもdispatchしない

REQUEST_TODOのaction creater(requestTodos)を作成

fetchDataにrequestTodosを追加、これは（connectでmapDispatchToPropsとして注入されてるので）propsから取れる

> 実装の流れは
> まずViewから、VisibleTodoListのrenderに追加、フラグとなるpropを先に定義しちゃって、それを取ってくるreducerのセレクタまで定義
> reducerを改定、セレクタを作成(createListに書いてそれをrootへと上げる)
> actionを規定
> 的な

## Dispatching Actions Asynchronously with Thunks
前節ではrequestTodosをfetchTodosの前に実行したが、これを自動で実行できればなお良い  

最初にコンポーネントからdispatchされるrequestTodosを削除、exportする必要がなくなるのでexport削除（requestTodos自体は消さない）
  
目標はfetchをしたときrequestTodos()をdispatchし、fetchが終了したらreceiveTodos()をdispatchするが、、fetchTodos action createrは単にreceiveTodosのみを解決するようにすること  

action のPromiseは完了するまでに一つのactionだけを解決するが、一連の実行の最中に複数のactionをdispatchできるようにしたい。これがPromiseを返すよりも、dispatchのcallback引数が入力される関数を返したい理由になる

この変更により、非同期処理の実行中、いくつでもどのタイミングでもdispatchを行えるようになる。requestTodosを最初にdispatchし、Promiseが解決されたら明示的にreceiveTodosをdispatchできるようになる。

この変更は記述量は多くなるがより柔軟な構成になる。Promiseは一つの非同期な値だけを扱えるため、fetchTodosはコールバック引数を持つ関数を返すようになり、非同期処理の間に何回も呼び出せるようになる  

他の関数によって返される関数はthunksと呼ばれる、これをサポートするライブラリを導入する  

configureStore.jsからredux-promiseを削除しthunk middlewareに置き換える
thunk middlewareはthunksのdispatchを補助する。他のmiddlewareと同様、store, 次のmiddleware(next)、actionを引数に取る

もしactionが関数だった場合、これはthunkで、注入されるべき関数を求めているものとする。この場合はstore.dispatchとともにactionを呼ぶ

そうでない限り、単にactionの結果について次のmiddleware chainへ渡していく  


> おぼろげな理解だが、
> dispatchを引数にとるコールバック関数を書いてその中に非同期処理を書く、それをaction creatorとしておく
> ※ exportされるaction createrは全てVisibleTodosにおけるconnectでstore.dispatch(action)できるようになっている
> store.dispatch(callback_function)と命令が来たらcallback_funcitionの中身にstore.dispatchを渡してやるようにthunkがとりはからう
> (これまでは{'TOGGLE_TODO', id}みたいなオブジェクトを引数として渡していたが関数で今回は渡す)
> このためコールバック関数内で複数の処理を一括で実行可能、今回はrequestTodosとreceiveTodosが実行され、それぞれstore.dispatchに渡されて処理される
> とりあえず先に進もう


## Avoiding Race Conditions with Thunks
fake APIのディレイを5秒にすると問題が発生する  
リクエスト前にタブがすでにロードされはじめたかチェックしておらず、タブ切り替えをたくさん走らせると、たくさんのreceiveTodosが返ってくるため、潜在的に競合状態になる

これを解消するために、すでに与えられたfilterに対応するtodoをfetchし始めていたら、fetchTodos action createrから早めに抜けるようにする

getFetchingセレクタを利用して、すでに取得し始めているかのチェックをfetchTodosの内部で行う  
もしtrueが返って来たら何もdispatchせずにthunkから抜ける

getFetchingをreducerからimport、getStateはstoreに属するがaction creatorが直接アクセスする必要はない

thunk middleware内でstore.getStateを走らせて、actionの第二引数として渡し、fetchTodosでgetStateを受け取れるようにする  

これらの変更により、action creatorはactionを状況に応じてdispatchできる（最高で3つまでしか同時にfetchしに行かないようになる）

isFetchnigフラグはreceiveTodosが戻って来たときにresetされる

即時returnでも動作はするようだが、thunkの返り値はPromiseなので、early returnをPromiseにして、それを受け取ってやるようにする
> Trueの最中にrequestを走らせるとdoneの方に落ちる

redux-thunkがこれまでインプリしてきたmiddlewareになる


## Displaying Error Messages
APIコールが失敗した時のことを考えthrow errorを仕込む(Promiseがrejectされる)  
この状態だとLodingが表示され続ける、isFetchingがtrueに設定されている一方でreceiveTodosが返ってこないのでfalseに落ちないため  

requestTodosはfetchTodosの外側では使われないので、内側に含めてしまう  
同じことはreceiveTodosにも言えるので内側に 
rejectハンドラをPromise.thenにも付ける

fetchTodosはいくつかactionをdispatchするので、名前をわかりやすく変更する, errorハンドラの方にも追加

Reducerもこれに対応してアップデート  
idとisFetchingについて、それぞれcase文の対応文字列変更
これで全てのケースを拾えるように  

Errorをユーザーに見せる用のコンポーネントを作成(FetchError.js)
> ビデオだとContainerに置いてたけど多分Presentational
propsとしてmessageとonRetryを受け取る  

これをVisibleTodosから描画、errorMessageを注入 
errorMessage自体はVisibleTodosのPropsから受け取れるようにmapStateToPropsへマッピング（getErrorMessage） 　
getErrorMessageはgetFetchingとほぼ同様、reducer(index.jsでcreateList.jsのものimport)に記載  
createList内では新たにerrorMessage reducerを作成、isFetchingらとcombineReducerでつなげる  
errorMessage自体はFailした時にaction.messageを返却、それ以外はnull

最後にAPIをランダムに返すように変更

promiseのerrorハンドリングだが、catchを利用する方法もある  
こちらは内部のエラーメッセージをユーザーに見せるかたちになるので、このシナリオでは使わないことをお勧め


## Creating Data on the Server
Fake APIにエンドポイント追加  
まずadd todoに相当するもの、次にtoggle todoに相当するものを作成

サーバー側でidを生成するのでaction creatorにv4は要らない  
addTodoもカリー化された引数としてdispatchを渡す 
渡されたdispatchはADD_TODO_SUCCESSをdispatch　

これに対応してreducer(byId)も変更  

これでADD TODOボタンがボタンが動くようになり、byIdも要素が4つに増えていることが確認できるが、listByFilterがアップデートされないためにリストにIDは3つしかなく、画面には反映されない　
他のタブを選んでまた戻ってくると、データの再取得が走るために見えるようになる

これを解消するためにcreateListにもADD_TODO_SUCCESSに対応するreducerを記載  
idsに追記、confirmationがサーバーから送られて来た時、新しいIDのリスト（以前のものの最後に追加されたIDが付与されたもの）を返すようにする  
他のアクションと違い、ADD_TODO_SUCCESSはfilterプロパティをactionに持たないために`filter !== acion.filter`がfailに落ちるために、この追加では動かない  
FETCH_TODO_SUCCESSとADD_TODO_SUCCESSでそれぞれ条件判定を変える


## Normalizing API Responses with normalizer
byId reducerはサーバーからの応答を別々にハンドルしている（異なるレスポンスの形をしているため）  
`FETCH_TODOS_SUCCESS`はtodoのアレイで、このアレイをイテレートして処理してマージしたものを返す  
`ADD_TODO_SUCCESS`はひとつのtodoで、異なる方法でマージされる  

新しいAPIコールごとに新しいcaseを着るよりも、レスポンスをノーマライズして同じ形にしたい  

`normalizr`をインストール

actionのディレクトリにschema.jsを作成
最初のスキーマにはtodo オブジェクト、todosをノーマライズされたレスポンスの辞書の名前とする  
次のスキーマがarraryOfTodos、todoのアレイを含むレスポンス  

action creatorのファイルに移りnormalizeをnormalizrからimport、 定義したスキーマも

FETCH＿TODOS＿SUCCESSコールバックの中に、「ノーマライズされたレスポンス」のログを追加することで、ノーマライズされたレスポンスがどのようなものかみることができる  
normalizeを元のresponseを第一引数に、対応するスキーマを第二引数にして呼ぶ  
同様のことをADD_TODOにも

レスポンスを比較してみると、ノーマライズされた方はentitiesとresultに別れていることがわかる  
entitiesはtodosと名付けられたノーマライズされた辞書を含み、レスポンス中の全てのtodoのidを含む
normalizrはarrayOfTodosのスキーマにしたがって、レスポンス中のtodo オブジェクトを見つける  
慣例的にIDによってインデックス化され、ルックアップテーブルへのマージも簡単

```javascript
// entitiesの中身
{
  "todos": {
    "a7fe3522-f184-44fb-bfc2-4e8f1992a9dc": {
      "id": "a7fe3522-f184-44fb-bfc2-4e8f1992a9dc",
      "text": "hey",
      "completed": true
    },
    "38983de8-0aa2-468d-b7ef-33506d92a5bb": {
      "id": "38983de8-0aa2-468d-b7ef-33506d92a5bb",
      "text": "ho",
      "completed": true
    },
    "64a5cc46-3484-4252-8b82-ef19aff18a0a": {
      "id": "64a5cc46-3484-4252-8b82-ef19aff18a0a",
      "text": "let's go",
      "completed": false
    }
  }
}
```

もう一つはresult、 todoのidのアレイ。 オリジナルのレスポンスのアレイと同じ順序でidは並んでいる。しかし、normalizrはそれぞれのtodoをそのidで置き換えており、todo全てをtodosへと移動している

```javascript
// resultの中身
[
  "a7fe3522-f184-44fb-bfc2-4e8f1992a9dc",
  "38983de8-0aa2-468d-b7ef-33506d92a5bb",
  "64a5cc46-3484-4252-8b82-ef19aff18a0a"
]
```


```javascript
// ADD_TODOのレスポンス
{
  "entities": {
    "todos": {
      "f2115d2e-7b51-4c1d-9344-54da354d1ab9": {
        "id": "f2115d2e-7b51-4c1d-9344-54da354d1ab9",
        "text": "wow",
        "completed": false
      }
    }
  },
  "result": "f2115d2e-7b51-4c1d-9344-54da354d1ab9"
}
```

> キーとしてIDをひっぱりだしてくれる感じみたい？

これを利用するようにactionを変更  

対応するようにreducer（byId）も変更  
case文を削除することができる、というのもresponseの形状がノーマライズされるため
action.typeでスイッチングするよりも、actionがレスポンスのオブジェクトを持っているかどうかをチェックするようにする  

ルートreducerもこれに応じて変更する  

responseがresultフィールドを持ち、これがidのアレイとなる（ADD_TODOでは１つの要素）

> 記述量は減るが


## Simplifying the Arrow Function

アロー関数を使う場合、単にシンプルなオブジェクトを返すだけならreturn文を省略可能なケースがある  
Action Createrが今回それに相当し、return文を削除し、代わりに()で囲むことで代用できる  
mapStateToPropsやmapDispathcToPropsも同様に省略できるケースが多い  

またオブジェクト内でアロー関数を定義するときには`:`と`=>`を省略できる

```
onClick: () => {}

onClick() {}  //Standard styleではカッコの前にスペース入れる必要があって怒られる
```

> やりすぎ感あるがひとまずこのまま進む

## Supplying the Initial State
あらかじめ初期値を外部から与えたい場合は`createStore()`の第二引数にオブジェクトを渡せば変更できる  
ただこれを利用するとテストしづらく、またreducerを後で変更しづらくなってしまう  

## Persisting the State to the Local Storage
localStorage APIを利用してのユーザーのストレージの利用
stateをシリアライズできないと`stringify`はできないが、ReduxではStateはシリアライズできる状態であることが望ましい
> Standardだと`window.localStorage`とちゃんと宣言しないと怒られる

初期値としてローカルストアから値取得し入れて、storeが更新されるたびローカルストアに書き込むようにする

ただこれだとReactがkeyとして同じid割り当てると怒られることがある  
一度ブラウザ更新するとkeyに割り当てられているnextTodoIdがリフレッシュされて0から始まるため

これを解消するのにuuidを利用する

また頻繁にシリアライズするのはコストが高いのでスロットリングをかける  
1秒に1回だけローカルストアに書き込み権限をつける

## Persisting the State to the Local Storage
Storeの作成とPersistaneロジックの部分を外だし

storeをExportするのではなくconfigureStore()のようにstoreを返す関数を返すことで、テストの際に複数のStoreを作成できるようになる

またpropsをstoreから受けとるコンポーネントを`<Root />`として分離

> modelと、Containerと、エントリーポイント（controllerっぽい？）の分離

Rootは一見シンプルだがこのあと色々追加していく


## Adding React Router to the Project
ルーティングをSPAでも行うためにreact-routerを導入
`Router`と`Route`コンポーネントをRoot.js に追加
<App />を<Router />に変更、これを<Provider />の下に置き続けることでStoreの情報が伝わっていく
> チュートリアルはv3以前っぽいのでv4でやってみよう
> v3だとbrowserHistoryを導入しないと各リンクに自動でハッシュが振られる模様


## Navigating with React Router <Link>
アドレスの変化を実装すし、ブラウザバックなどに対応させる

`Route`にpropsとしてpathとcomponentを与える  
pathには?をつけると、それがオプションであるという宣言になる

> pathに与えたものと合致するpropsがcomponentにあると、その状態にアドレスが対応する模様

activeとcompletedをアドレスバーに表示させるために、Footerからfilterとして与える名称を変更

これまでの実装ではリンクがクリックされた時の挙動を定義するためにFilterLinkでStoreから注入していたが、routerにurlに関する状態は管理させる  
そのため不要な部分を削って新しいコンポーネントを持ってくる  
`NavLink`コンポーネントでリンクを作成、activeStyleでその状態がアクティブなときのスタイルを定義
exactを指定すると正確にロケーションと一致している時でないとスタイルが適用されない
> v4からはNavLinkにしないとスタイル指定ができない

setVisibilityFilterのAction Createrはいらないので削除、Link.jsもいらないので削除

> この段階でURLがリンクをクリックすると付与されるように
> ただ対応する挙動が定義されてないので見た目は変化しない
> webpack-dev-serverのデバッグモードだとリンク付与がされない？

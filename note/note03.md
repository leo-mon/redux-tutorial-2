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
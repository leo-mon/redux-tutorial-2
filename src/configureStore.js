import { createStore } from 'redux'
import todoApp from './reducers'

// dispatchをオーバーライドしログを残すようにするメソッド
const addLoggingToDispatch = (store) => {
  const rawDispatch = store.dispatch  // もともとのdispatch()を保持
  if (!console.group) {
    return rawDispatch  // 非対応ブラウザではロギングせず
  }
  return (action) => {
    console.group(action.type)  // ログをアクション名でグルーピング
    console.log('%c prev state', 'color: gray', store.getState())
    console.log('%c action', 'color: blue', action)
    const returnValue = rawDispatch(action)  // 一旦結果保持
    console.log('%c next state', 'color: green', store.getState())
    console.groupEnd(action.type)
    return returnValue  // 結果返却
  }
}

// Store周りの設定（初期値代入やDispatcherの登録、ローカルストレージへの保存）
const configureStore = () => {
  const store = createStore(todoApp)  // Reducer登録

  if (process.env.NODE_ENV !== 'production') {  // プロダクション環境ではオーバーライド無効
    store.dispatch = addLoggingToDispatch(store)  // dispatch()をオーバーライド
  }

  return store
}

export default configureStore

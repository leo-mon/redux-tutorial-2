import { createStore } from 'redux'
import todoApp from './reducers'

// dispatchをオーバーライドしログを残すようにするmiddleware function
const logger = (store) => (next) => {
  if (!console.group) {
    return next  // 非対応ブラウザではロギングせず
  }
  return (action) => {
    console.group(action.type)  // ログをアクション名でグルーピング
    console.log('%c prev state', 'color: gray', store.getState())
    console.log('%c action', 'color: blue', action)

    const returnValue = next(action)  // 一旦結果保持

    console.log('%c next state', 'color: green', store.getState())
    console.groupEnd(action.type)
    return returnValue  // 結果返却
  }
}

// dispatchをオーバライドしてPromiseを受け取れるようにするmiddleware function
const promise = (store) => (next) => (action) => {
  if (typeof action.then === 'function') {
    return action.then(next)
  }
  return next(action)
}

/*
const promise = (store) => {
  return (next) => {
    return (action) => {
      if (typeof action.then === 'function') {
        return action.then(next)
      }
      return next(action)
    }
  }
}
*/

// middlewareをdispatchへと適用してオーバーライドする関数
const wrapDispatchWithMiddlewares = (store, middlewares) =>
  middlewares.slice().reverse().forEach(middleware => {  // 非同期→ログと自然な順番で記述できるようreverse
    store.dispatch = middleware(store)(store.dispatch)
  })

// Store周りの設定（初期値代入やDispatcherの登録、ローカルストレージへの保存）
const configureStore = () => {
  const store = createStore(todoApp)  // Reducer登録
  const middlewares = [promise]

  if (process.env.NODE_ENV !== 'production') {  // プロダクション環境ではオーバーライド無効
    middlewares.push(logger)
  }

  wrapDispatchWithMiddlewares(store, middlewares)  // オーバーライド

  return store
}

export default configureStore

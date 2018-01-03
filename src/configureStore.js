import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import todoApp from './reducers'

const thunk = (store) => (next) => (action) =>
  typeof action === 'function'  // もし関数()をdispatchしろと渡されたら
    ? action(store.dispatch)  // store.dispatchを引数としてactionに与え、その中でdispatchを走らせる
    : next(action)  // そうでない場合は次のミドルウェアへ処理を渡す

// Store周りの設定（初期値代入やDispatcherの登録、ローカルストレージへの保存）
const configureStore = () => {
  const middlewares = [thunk]
  if (process.env.NODE_ENV !== 'production') {  // プロダクション環境ではオーバーライド無効
    middlewares.push(createLogger)
  }

  return createStore(
    todoApp,  // ここtodoAppのままで動く... => export defaultしてるのでtodosが読まれるため
    applyMiddleware(...middlewares)
  )
}

export default configureStore

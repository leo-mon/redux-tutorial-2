import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise'
import createLogger from 'redux-logger'
import todoApp from './reducers'

// Store周りの設定（初期値代入やDispatcherの登録、ローカルストレージへの保存）
const configureStore = () => {
  const middlewares = [promise]
  if (process.env.NODE_ENV !== 'production') {  // プロダクション環境ではオーバーライド無効
    middlewares.push(createLogger)
  }

  return createStore(
    todoApp,
    applyMiddleware(...middlewares)
  )
}

export default configureStore

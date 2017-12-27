import { createStore } from 'redux'
import throttle from 'lodash/throttle'
import todoApp from './reducers'
import { loadState, saveState } from './localStorage'

const configureStore = () => {
  const persistedState = loadState()  // ローカルストレージから初期値を代入
  const store = createStore(todoApp, persistedState)  // Reducer登録

  store.subscribe(throttle(() => {  // Storeが更新されたらStateをローカルに, 1秒に1回のみ
    saveState({
      todos: store.getState().todos  // 書き込むのはtodosのみ
    })
  }, 1000))

  return store
}

export default configureStore

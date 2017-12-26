import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash/throttle'

const persistedState = loadState()  // ローカルストレージから初期値を代入

let store = createStore(todoApp, persistedState)  // Reducer登録
console.log(store.getState())

store.subscribe(throttle(() => {  // Storeが更新されるたびにStateをローカルストレージに書き込み, 1秒に1回だけ許可
  saveState({
    todos: store.getState().todos  // 書き込むのはtodosのみ
  })
}, 1000))

/* 頻繁に保存するのは処理能力の無駄
store.subscribe(() => {  // Storeが更新されるたびにStateをローカルストレージに書き込み
  saveState({
    todos: store.getState().todos  // 書き込むのはtodosのみ
  })
})
*/
/*  VisibilityFilterまで保存してしまう
store.subscribe(() => {  // Storeが更新されるたびにStateをローカルストレージに書き込み
  saveState(store.getState())
})
*/

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

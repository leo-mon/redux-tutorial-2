import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

const persistedState = {  // Storeに与えることのできる初期値
  todos: [{
    id: 0,
    text: 'Welcome Back!',
    completed: false
  }],
  visibilityFilter: 'SHOW_ACTIVE'  // 与えない場合はreducerのデフォルト値が入る
}

let store = createStore(todoApp, persistedState)  // Reducer登録
console.log(store.getState())

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

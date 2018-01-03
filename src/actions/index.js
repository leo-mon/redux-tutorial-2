import { v4 } from 'node-uuid'
import * as api from '../api'
import { getIsFetching } from '../reducers'

// Action Creators

export const addTodo = (text) => ({  // acton creator, dispatchされるアクションを返す
  type: 'ADD_TODO',
  id: v4(),
  text
})

export const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
})

const requestTodos = (filter) => ({
  type: 'REQUEST_TODOS',
  filter
})

const receiveTodos = (filter, response) => ({
  type: 'RECEIVE_TODOS',
  filter,
  response
})

export const fetchTodos = (filter) => (dispatch, getState) => {  // thunkによってstore.dispatchがdispatchには渡される, getStateはredux-thunkが渡してくれる？
  if (getIsFetching(getState(), filter)) {  // fetch中はこちらに落ちる
    return Promise.resolve()  // thunkの返り値をPromiseにするため
  }
  dispatch(requestTodos(filter))

  return api.fetchTodos(filter).then(response => {
    dispatch(receiveTodos(filter, response))  // 解決されたらreceiveTodoをdispatch
  })
}

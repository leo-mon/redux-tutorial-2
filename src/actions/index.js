import { normalize } from 'normalizr'
import * as schema from './schema'
import * as api from '../api'
import { getIsFetching } from '../reducers'

// Action Creators

export const addTodo = (text) => (dispatch) =>  // fetchTodosを参考にthunkにする
  api.addTodo(text).then(response => {  // Promiseが解決したらDispatch
    dispatch({
      type: 'ADD_TODO_SUCCESS',
      response: normalize(response, schema.todo)
    })
  })

export const toggleTodo = (id) => (dispatch) =>
  api.toggleTodo(id).then(response => {
    dispatch({
      type: 'TOGGLE_TODO_SUCCESS',
      response: normalize(response, schema.todo)
    })
  })

export const fetchTodos = (filter) => (dispatch, getState) => {  // thunkによってstore.dispatchがdispatchには渡される, getStateはredux-thunkが渡してくれる？
  if (getIsFetching(getState(), filter)) {  // fetch中はこちらに落ちる
    return Promise.resolve()  // thunkの返り値をPromiseにするため
  }
  dispatch({
    type: 'FETCH_TODOS_REQUEST',
    filter
  })

  return api.fetchTodos(filter).then(
    // 成功時
    response => {
      dispatch({
        type: 'FETCH_TODOS_SUCCESS',
        filter,
        response: normalize(response, schema.arrayOfTodos)
      }) // 解決されたらreceiveTodoをdispatch
    },
    // 失敗時
    error => {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        filter,
        message: error.message || 'Something went wrong.'
      })
    }
  )
}

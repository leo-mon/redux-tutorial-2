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
        response
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

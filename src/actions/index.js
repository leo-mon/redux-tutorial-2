import { v4 } from 'node-uuid'
import * as api from '../api'

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

const receiveTodos = (filter, response) => ({
  type: 'RECEIVE_TODOS',
  filter,
  response
})

export const fetchTodos = (filter) =>
  api.fetchTodos(filter).then(response =>  // Promiseを返す
    receiveTodos(filter, response)  // 解決されたらreceiveTodoを返してくる
  )

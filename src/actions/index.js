import { v4 } from 'node-uuid'

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

export const receiveTodos = (filter, response) => ({
  type: 'RECEIVE_TODOS',
  filter,
  response
})

import { v4 } from 'node-uuid'

// Action Creators

export const addTodo = (text) => ({  // acton creator, dispatchされるアクションを返す
  type: 'ADD_TODO',
  id: v4(),
  text
})
/*
export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})
*/

export const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
})

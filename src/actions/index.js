// Action Creators

let nextTodoId = 0  // action.idに利用するグローバル変数
export const addTodo = (text) => ({  // acton creator, dispatchされるアクションを返す
  type: 'ADD_TODO',
  id: (nextTodoId++).toString(),
  text
})

export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
})

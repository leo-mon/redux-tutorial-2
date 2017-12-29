import { combineReducers } from 'redux'
import todos, * as fromTodos from './todos'

// トップレベルのReducer
const todoApp = combineReducers({
  todos
})

export default todoApp

export const getVisibleTodos = (state, filter) =>
  fromTodos.getVisibleTodos(state.todos, filter)

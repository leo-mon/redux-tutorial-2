import { combineReducers } from 'redux'
import todos from './todos'

// トップレベルのReducer
const todoApp = combineReducers({
  todos
})

export default todoApp

import { combineReducers } from 'redux'

// 一つ一つのtodoを管理するreducer
const byId = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_TODOS':
      const nextState = { ...state }
      action.response.forEach(todo => {
        nextState[todo.id] = todo
      })
      return nextState
    default:
      return state
  }
}

// ID全体を管理するreducer
const allIds = (state = [], action) => {
  if (action.filter !== 'all') {
    return state
  }
  switch (action.type) {
    case 'RECEIVE_TODOS':
      return action.response.map(todo => todo.id)
    default:
      return state
  }
}

// activeなIDを管理するreducer
const activeIds = (state = [], action) => {
  if (action.filter !== 'active') {
    return state
  }
  switch (action.type) {
    case 'RECEIVE_TODOS':
      return action.response.map(todo => todo.id)
    default:
      return state
  }
}

// completedなIDを管理するreducer
const completedIds = (state = [], action) => {
  if (action.filter !== 'completed') {
    return state
  }
  switch (action.type) {
    case 'RECEIVE_TODOS':
      return action.response.map(todo => todo.id)
    default:
      return state
  }
}

// フィルタごとに状態を管理するreducer
const idsByFilter = combineReducers({
  all: allIds,
  active: activeIds,
  completed: completedIds
})

const todos = combineReducers({
  byId,
  idsByFilter
})

export default todos

export const getVisibleTodos = (state, filter) => {
  const ids = state.idsByFilter[filter]
  return ids.map(id => state.byId[id])
}

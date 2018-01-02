import { combineReducers } from 'redux'
import byId, * as fromById from './byId'
import createList, * as fromList from './createList'

// フィルタごとに状態(IDのアレイ)を管理するreducer
const listByFilter = combineReducers({
  all: createList('all'),
  active: createList('active'),
  completed: createList('completed')
})

// ルートのreducer
const todos = combineReducers({
  byId,  // Idに対応したTodo
  listByFilter  // フィルタごとのIDアレイ
})

export default todos

// filterに応じて描画されるTodoを返す
export const getVisibleTodos = (state, filter) => {
  const ids = fromList.getIds(state.listByFilter[filter])   // そのフィルタに属するIDのアレイを取得
  return ids.map(id => fromById.getTodo(state.byId, id))  // IDのアレイから対応するTodoを取得・返却
}

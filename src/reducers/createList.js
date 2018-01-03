import { combineReducers } from 'redux'

// 対応するフィルタ(all, active, completed)に関する状態を管理するreducerを生成
const createList = (filter) => {
  // idのアレイを管理
  const ids = (state = [], action) => {
    if (action.filter !== filter) {  // 自身の管轄外のfilterの時は処理をしない
      return state
    }
    switch (action.type) {
      case 'RECEIVE_TODOS':
        return action.response.map(todo => todo.id)  // そのフィルタに対応するIDのアレイを返却
      default:
        return state
    }
  }
  // データのローディングを管理
  const isFetching = (state = false, action) => {
    if (action.filter !== filter) {
      return state
    }
    switch (action.type) {
      case 'REQUEST_TODOS':
        return true
      case 'RECEIVE_TODOS':
        return false
      default:
        return state
    }
  }

  return combineReducers({
    ids,
    isFetching
  })
}

export default createList

export const getIds = (state) => state.ids  // IDのアレイを外部から取得する際のセレクタ
export const getIsFetching = (state) => state.isFetching  // データローディングの状態取得のセレクタ

import { combineReducers } from 'redux'

// 対応するフィルタ(all, active, completed)に関する状態を管理するreducerを生成
const createList = (filter) => {
  // idのアレイを管理
  const ids = (state = [], action) => {
    switch (action.type) {
      case 'FETCH_TODOS_SUCCESS':
        return filter === action.filter  // 三項演算子に判定変更
          ? action.response.result
          : state
      case 'ADD_TODO_SUCCESS':
        return filter !== 'completed'  // completed以外のアレイに追加
          ? [...state, action.response.result]
          : state
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
      case 'FETCH_TODOS_REQUEST':
        return true
      case 'FETCH_TODOS_SUCCESS':
      case 'FETCH_TODOS_FAILURE':
        return false
      default:
        return state
    }
  }

  // エラーメッセージの有無、中身を管理
  const errorMessage = (state = null, action) => {
    if (filter !== action.filter) {
      return state
    }
    switch (action.type) {
      case 'FETCH_TODOS_FAILURE':
        return action.message
      case 'FETCH_TODOS_REQUEST':
      case 'FETCH_TODOS_SUCCESS':
        return null
      default:
        return state
    }
  }

  return combineReducers({
    ids,
    isFetching,
    errorMessage
  })
}

export default createList

export const getIds = (state) => state.ids  // IDのアレイを外部から取得する際のセレクタ
export const getIsFetching = (state) => state.isFetching  // データローディングの状態取得のセレクタ
export const getErrorMessage = (state) => state.errorMessage

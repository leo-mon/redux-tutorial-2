// 特定のIDをもつtodoを管理するreducer
const byId = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_TODOS_SUCCESS':
      const nextState = { ...state }  // 浅いコピー
      action.response.forEach(todo => {
        nextState[todo.id] = todo  // 該当するIDの部分を更新
      })
      return nextState
    default:
      return state
  }
}

export default byId

export const getTodo = (state, id) => state[id]  // 外部からbyIdにアクセスする際のセレクタ

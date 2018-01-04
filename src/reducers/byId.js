// 特定のIDをもつtodoを管理するreducer
const byId = (state = {}, action) => {
  if (action.response) {
    return {
      ...state,
      ...action.response.entities.todos
    }
  }
  return state
}

export default byId

export const getTodo = (state, id) => state[id]  // 外部からbyIdにアクセスする際のセレクタ

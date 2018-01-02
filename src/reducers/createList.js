// 対応するフィルタに関するreducerを生成
const createList = (filter) => {
  return (state = [], action) => {
    if (action.filter !== filter) {
      return state
    }
    switch (action.type) {
      case 'RECEIVE_TODOS':
        return action.response.map(todo => todo.id)  // そのフィルタに対応するIDのアレイを返却
      default:
        return state
    }
  }
}

export default createList

export const getIds = (state) => state  // IDのアレイを外部から取得する際のセレクタ

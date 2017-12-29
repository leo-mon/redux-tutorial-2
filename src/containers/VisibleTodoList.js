import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'all':
      return todos
    case 'completed':
      return todos.filter(t => t.completed)
    case 'active':
      return todos.filter(t => !t.completed)
    default:
      throw new Error(`Unkwown filter: ${filter}.`)
  }
}

const mapStateToProps = (state, { match }) => ({
  todos: getVisibleTodos(
    state.todos,
    match.params.filter || 'all'  // 何もない場合はallに落ちる
  )
})
const mapDispatchToProps = (dispatch) => ({
  onTodoClick (id) {
    dispatch(toggleTodo(id))
  }
})
const VisibleTodoList = withRouter(connect(  // Routeからの情報注入
  mapStateToProps,  // TodoListへ注入するStateを返す関数
  mapDispatchToProps  // TodoListへ注入するdispatcherを返す関数
)(TodoList))

export default VisibleTodoList

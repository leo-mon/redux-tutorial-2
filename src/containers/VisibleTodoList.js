import { connect } from 'react-redux'
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

const mapStateToProps = (state, ownProps) => ({
  todos: getVisibleTodos(
    state.todos,
    ownProps.filter
  )
})
const mapDispatchToProps = (dispatch) => ({
  onTodoClick (id) {
    dispatch(toggleTodo(id))
  }
})
const VisibleTodoList = connect(  // connectを利用してstoreとのやりとり
  mapStateToProps,  // TodoListへ注入するStateを返す関数
  mapDispatchToProps  // TodoListへ注入するdispatcherを返す関数
)(TodoList)

export default VisibleTodoList

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'
import { getVisibleTodos } from '../reducers'

const mapStateToProps = (state, { match }) => ({
  todos: getVisibleTodos(
    state,
    match.params.filter || 'all'  // 何もない場合はallに落ちる
  )
})
const VisibleTodoList = withRouter(connect(  // Routeからの情報注入
  mapStateToProps,  // TodoListへ注入するStateを返す関数
  { onTodoClick: toggleTodo }  // TodoListへ注入するdispatcherを返す関数、簡略表記
)(TodoList))

export default VisibleTodoList

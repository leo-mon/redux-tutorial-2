import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'
import { getVisibleTodos } from '../reducers'
import { fetchTodos } from '../api'

class VisibleTodoList extends Component {
  componentDidMount () {
    fetchTodos(this.props.filter).then(todos =>
      console.log(this.props.filter, todos)
    )
  }
  componentDidUpdate (prevProps) {
    if (this.props.filter !== prevProps.filter) {  // 変更前とfilterの値が変わっていたら
      fetchTodos(this.props.filter).then(todos =>
        console.log(this.props.filter, todos)
      )
    }
  }
  render () {
    return <TodoList {...this.props} />
  }
}

const mapStateToProps = (state, { match }) => {
  const filter = match.params.filter || 'all'  // ライフサイクル利用のためfilter利用
  return {
    todos: getVisibleTodos(state, filter),
    filter
  }
}

VisibleTodoList = withRouter(connect(  // Standardはエラーを吐くが一旦無視、ReduxとRouterからの情報注入
  mapStateToProps,  // TodoListへ注入するStateを返す関数
  { onTodoClick: toggleTodo }  // TodoListへ注入するdispatcherを返す関数、簡略表記
)(VisibleTodoList))

export default VisibleTodoList

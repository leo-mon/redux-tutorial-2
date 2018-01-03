import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../actions'
import TodoList from '../components/TodoList'
import { getVisibleTodos, getIsFetching } from '../reducers'

class VisibleTodoList extends Component {
  componentDidMount () {
    this.fetchData()
  }

  componentDidUpdate (prevProps) {
    if (this.props.filter !== prevProps.filter) {  // 変更前とfilterの値が変わっていたら
      this.fetchData()
    }
  }

  fetchData () {  // Fake APIから値を取得しStoreへと書き込む
    const { filter, fetchTodos } = this.props
    fetchTodos(filter).then(() => console.log('done!'))
  }

  render () {
    const { toggleTodo, todos, isFetching } = this.props
    if (isFetching && !todos.length) {
      return <p>Loading...</p>   // requestTodos実行時はこちらを表示
    }

    return (
      <TodoList
        todos={todos}
        onTodoClick={toggleTodo}  // これだけonTodoClickとのマッピングで渡す
      />
    )
  }
}

const mapStateToProps = (state, { match }) => {
  const filter = match.params.filter || 'all'  // ライフサイクル利用のためfilter利用
  return {
    todos: getVisibleTodos(state, filter),
    isFetching: getIsFetching(state, filter),
    filter
  }
}

VisibleTodoList = withRouter(connect(  // Standardはエラーを吐くが一旦無視、ReduxとRouterからの情報注入
  mapStateToProps,  // VisibleTodoListへ注入するStateを返す関数
  actions  // VisibleTodoListへ注入するactionたち
)(VisibleTodoList))

export default VisibleTodoList

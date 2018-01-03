import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../actions'
import TodoList from '../components/TodoList'
import { getVisibleTodos, getIsFetching, getErrorMessage } from '../reducers'
import FetchError from '../components/FetchError'

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
    fetchTodos(filter).then(/* () => console.log('done!') */)
  }

  render () {
    const { toggleTodo, todos, isFetching, errorMessage } = this.props
    // データ取得中はこれを表示
    if (isFetching && !todos.length) {
      return <p>Loading...</p>
    }
    // 取得に失敗した時などのエラーが出た時はこちら表示
    if (errorMessage && !todos.length) {
      return (
        <FetchError
          message={errorMessage}
          onRetry={() => this.fetchData()}
        />
      )
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
    errorMessage: getErrorMessage(state, filter),
    filter
  }
}

VisibleTodoList = withRouter(connect(  // Standardはエラーを吐くが一旦無視、ReduxとRouterからの情報注入
  mapStateToProps,  // VisibleTodoListへ注入するStateを返す関数
  actions  // VisibleTodoListへ注入するactionたち
)(VisibleTodoList))

export default VisibleTodoList

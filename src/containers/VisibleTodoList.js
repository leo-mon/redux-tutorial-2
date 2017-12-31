import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../actions'
import TodoList from '../components/TodoList'
import { getVisibleTodos } from '../reducers'
import { fetchTodos } from '../api'

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
    const { filter, receiveTodos } = this.props  // どちらもmapXXToPropsで注入済
    fetchTodos(filter).then(todos =>
      receiveTodos(filter, todos)
    )
  }

  render () {
    const { toggleTodo, ...rest } = this.props
    return (
      <TodoList
        {...rest}
        onTodoClick={toggleTodo}  // これだけonTodoClickとのマッピングで渡す
      />
    )
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
  mapStateToProps,  // VisibleTodoListへ注入するStateを返す関数
  actions  // VisibleTodoListへ注入するactionたち
)(VisibleTodoList))

export default VisibleTodoList

import React from 'react'

// エラーメッセージをユーザーに示すためのコンポーネント
const FetchError = ({ message, onRetry }) => (
  <div>
    <p>Could not fetch todos. {message}</p>
    <button onClick={onRetry}>Retry</button>
  </div>
)

export default FetchError

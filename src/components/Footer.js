import React from 'react'
import FilterLink from '../containers/FilterLink'

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink filter='all'> {/* filterの値をルーティングに利用する */}
      All
    </FilterLink>
    {' '}
    <FilterLink filter='active'>
      Active
    </FilterLink>
    {' '}
    <FilterLink filter='completed'>
      Completed
    </FilterLink>
  </p>
)

export default Footer

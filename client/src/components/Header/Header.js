import React from 'react'
import styles from './header.css'
import { NavLink, Link } from 'react-router-dom'
import { Header as HeaderGrommet } from 'grommet'

export default function Header() {
  return (
    <HeaderGrommet background='brand' pad='medium'>
      <div className={styles.logoWrap}>
        <Link to='/'>logo</Link>
      </div>
      <div className={styles.links}>
        <NavLink to='/about' activeClassName={styles.active}>
          about us
        </NavLink>
        <NavLink to='/signup' activeClassName={styles.active}>
          signup
        </NavLink>
        <NavLink to='/login' activeClassName={styles.active}>
          login
        </NavLink>
      </div>
    </HeaderGrommet>
  )
}

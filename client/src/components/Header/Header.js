import React, { Fragment } from 'react'
import styles from './header.css'
import { NavLink, Link, useHistory } from 'react-router-dom'
import { Header as HeaderGrommet } from 'grommet'

export default function Header(props) {
  const history = useHistory()

  function onLogout(e) {
    e.preventDefault()
    localStorage.removeItem('userToken')
    return history.push(`/`)
  }

  return (
    <HeaderGrommet background='brand' pad='medium'>
      <div className={styles.logoWrap}>
        <Link to='/'>logo</Link>
      </div>
      <div className={styles.links}>
        <NavLink to='/about' activeClassName={styles.active}>
          about us
        </NavLink>
        {localStorage.userToken ? (
          <Fragment>
            <NavLink to='/profile' activeClassName={styles.active}>
              my profile
            </NavLink>
            <a href='' onClick={(e) => onLogout(e)}>
              logout
            </a>
          </Fragment>
        ) : (
          <Fragment>
            <NavLink to='/signup' activeClassName={styles.active}>
              signup
            </NavLink>
            <NavLink to='/login' activeClassName={styles.active}>
              login
            </NavLink>
          </Fragment>
        )}
      </div>
    </HeaderGrommet>
  )
}

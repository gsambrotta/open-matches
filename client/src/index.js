import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Grommet } from 'grommet'
import { theme } from './styles/theme.js'
import styles from './styles/base.css'
import { env } from '../../config'
import jwt_decode from 'jwt-decode'

import Header from './components/Header/Header'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'
import Welcome from './pages/Welcome'
import Registration from './components/Registration/Registration'
import UserProfile from './components/UserProfile/UserProfile'
import { onLogout } from './functions/User'

function ErrorPage() {
  return (
    <div style={{ color: 'white' }}>
      Ooops there were an error! Go back to <Link to='/'>homepage</Link>
    </div>
  )
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      decodedToken: '',
    }
  }

  componentDidMount() {
    // const token = localStorage.userToken
    // const isLoggedin = localStorage.getItem('userToken')
    // this.setState({
    //   decodedToken: isLoggedin && jwt_decode(token),
    // })
  }

  render() {
    return (
      <Router>
        <Grommet theme={theme}>
          <section className={styles.main}>
            <Header onLogout={onLogout} />
            <div className={styles.container}>
              <Switch>
                <Route exact path='/' component={Welcome} />
                <Route path='/signup' component={Signup} />
                <Route path='/login' component={Login} />
                <Route path='/registration' component={Registration} />
                <Route
                  exact
                  path='/profile'
                  render={(props) => (
                    <UserProfile token={this.state.decodedToken} {...props} />
                  )}
                />
                <Route component={ErrorPage} />
              </Switch>
            </div>
          </section>
        </Grommet>
      </Router>
    )
  }
}

export default App

ReactDOM.render(<App />, document.getElementById('app'))

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

function Test() {
  const [data, setData] = useState('empty')

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch(`${env.API_URL}/api/hello`)
        const json = await response.json()
        return setData(json.text)
      } catch (err) {
        console.error(err)
      }
    }

    getData()
  }, [data])

  return <p style={{ color: 'white' }}>Response: {data}</p>
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      decodedToken: '',
    }
  }

  componentDidMount() {
    const token = localStorage.userToken
    const isLoggedin = localStorage.getItem('userToken')
    this.setState({
      decodedToken: isLoggedin && jwt_decode(token),
    })
  }

  render() {
    return (
      <Router>
        <Grommet theme={theme}>
          <section className={styles.main}>
            <Header onLogout={onLogout} />
            <div className={styles.container}>
              <Switch>
                <Route exact path='/'>
                  <Registration />
                </Route>
                <Route path='/hello' component={Test} />
                <Route path='/signup' component={Signup} />
                <Route path='/login' component={Login} />
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

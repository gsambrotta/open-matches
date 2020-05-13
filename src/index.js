import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Grommet } from 'grommet'
import { theme } from './styles/theme.js'
import styles from './styles/base.css'

import Header from './components/Header/Header'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Grommet theme={theme}>
          <section className={styles.main}>
            <Header />
            <div className={styles.container}>
              <Switch>
                <Route exact path='/'>
                  <Signup />
                </Route>
                <Route path='/signup' component={Signup} />
                <Route path='/login' component={Login} />
                {/* <Route exact path='/profile' component={Profile} /> */}
                {/* <Route component={404Page} /> */}
              </Switch>
            </div>
          </section>
        </Grommet>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

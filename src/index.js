import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Intro from './intro'
import Check from './check'

const App = () => (
  <Router>
    <Switch>
      <Route path='/intro' component={Intro} />
      <Route path='/check' component={Check} />
      <Route component={Intro} />
    </Switch>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('root'))

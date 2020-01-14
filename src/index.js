import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Intro from './intro'
import Check from './check'
import Main from './main'
import '../style/css/index.css'

const App = () => (
  <Router>
    <div className='left-door'></div>
    <div className='right-door'></div>
    <Switch>
      <Route path='/intro' component={Intro} />
      <Route path='/check' component={Check} />
      <Route path='/main' component={Main} />
      <Route component={Intro} />
    </Switch>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('root'))

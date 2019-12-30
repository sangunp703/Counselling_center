import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../style/css/login.css'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jump: ''
    }
  }
  render() {
    if (this.state.jump) {
      return <Redirect to={this.state.jump} />
    }
    return (
      <div className='login-container'>
        
      </div>
    )
  }
}

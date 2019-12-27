import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

export default class Check extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jump: ''
    }
  }
  enter(e) {
    this.setState({ jump: '/check' })
  }
  render() {
    if (this.state.jump) {
      return <Redirect to={this.state.jump} />
    }
    return (
      <div className='container'>
        <div>당신은?</div>
      </div>
    )
  }
}

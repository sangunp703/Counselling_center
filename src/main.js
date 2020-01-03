import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../style/css/main.css'

export default class Check extends Component {
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
      <div className='main-container'>
        <div className='layout-left'></div>
        <div className='layout-right'></div>
        <div className='table'></div>
      </div>
    )
  }
}

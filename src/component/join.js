import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../style/css/join.css'

export default class Join extends Component {
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
      <div className='join-container'>
        <img className="" src='' alt='identity-card'/>
      </div>
    )
  }
}

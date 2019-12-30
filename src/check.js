import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../style/css/check.css'

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
      <div className='check-container'>
        <div className='part'>
          <div className='login-box'></div>
        </div>
        <div className='part entrance'>
          <div class="talk-box">
            회원증이나 신분증을 보여주세요
          </div>
          <img className='security' src='' alt='silhouette' />
        </div>
        <div className='part'>
          <div className='join-box'></div>
        </div>
      </div>
    )
  }
}

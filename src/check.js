import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../style/css/check.css'
import Join from './component/join'

export default class Check extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jump: '',
      joinShow: false,
      loginShow: false
    }
  }

  openJoinBox(e) {
    this.setState({ joinShow: true })
  }

  render() {
    if (this.state.jump) {
      return <Redirect to={this.state.jump} />
    }
    return (
      <div className='check-container'>
        <div className='partition'>
          <div className='part'>
            <div className='login-box'></div>
          </div>
          <div className='part entrance'>
            <div class='talk-box'>회원증이나 신분증을 보여주세요</div>
            <img className='security' src='' alt='silhouette' />
          </div>
          <div className='part'>
            <img className='join-box' src='' alt='주민등록증' onClick={e => this.openJoinBox(e)}></img>
          </div>
        </div>
        <Join show={this.state.joinShow} />
      </div>
    )
  }
}

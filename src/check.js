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
    this.jumpCallback = this.jumpCallback.bind(this) // 함수의 this를 본 요소에 바인딩
  }

  openJoinBox(e) {
    this.setState({ joinShow: true })
  }

  jumpCallback(jumpData) {
    this.setState({
      jump: jumpData
    })
  }

  partIn(e) {
    e.currentTarget.parentNode.querySelectorAll('.part').forEach(element => {
      element.classList.remove('active')
    })
    e.currentTarget.classList.add('active')
  }

  talkToSecurity(e) {
    e.currentTarget.parentNode.querySelector('.guide').style.opacity = 1
  }

  render() {
    if (this.state.jump) {
      return <Redirect to={this.state.jump} />
    }
    return (
      <div className='check-container'>
        <div className='partition'>
          <div className='part' onMouseEnter={e => this.partIn(e)}>
            <div className='login-box'></div>
          </div>
          <div className='part active' onMouseEnter={e => this.partIn(e)}>
            <div className='guide'>
              <span className='guide-login'>&lt; 로그인</span>
              <span className='guide-join'>회원가입 &gt;</span>
            </div>
            <img className='security' src='' alt='silhouette' onClick={e => this.talkToSecurity(e)} />
          </div>
          <div className='part' onMouseEnter={e => this.partIn(e)}>
            <img className='join-box' src='' alt='주민등록증' onClick={e => this.openJoinBox(e)}></img>
          </div>
        </div>
        <Join show={this.state.joinShow} jump={this.jumpCallback} />
      </div>
    )
  }
}

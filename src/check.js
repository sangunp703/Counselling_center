import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../style/css/check.css'
import Join from './component/join'
import Login from './component/login'

export default class Check extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jump: '',
      show: 'none'
    }
    this.jumpCallback = this.jumpCallback.bind(this)
    this.showCallback = this.showCallback.bind(this)
  }

  componentDidMount() {
    this.openDoor()
  }

  openDoor() {
    const left_door = document.querySelector('.left-door')
    const right_door = document.querySelector('.right-door')
    left_door.style.width = '0vw'
    right_door.style.width = '0vw'
  }

  closeDoor() {
    const left_door = document.querySelector('.left-door')
    const right_door = document.querySelector('.right-door')
    left_door.style.width = '50vw'
    right_door.style.width = '50vw'
  }

  showCallback(showData) {
    this.setState({
      show: showData
    })
  }

  jumpCallback(jumpData) {
    this.closeDoor()
    setTimeout(e => {
      this.setState({
        jump: jumpData
      })
    }, 1500)
  }

  openJoinBox(e) {
    this.setState({ show: 'join' })
  }

  openLoginBox(e) {
    this.setState({ show: 'login' })
  }

  partIn(e) {
    e.currentTarget.parentNode.querySelectorAll('.part').forEach(element => {
      element.classList.remove('active')
    })
    e.currentTarget.classList.add('active')
  }

  talkToSecurity(e) {
    e.currentTarget.parentNode.querySelectorAll('span').forEach(element => {
      element.style.opacity = 1
    })
  }

  render() {
    if (this.state.jump) {
      return <Redirect to={this.state.jump} />
    }
    return (
      <div className='check-container'>
        <div className='partition'>
          <div className='part' onMouseEnter={e => this.partIn(e)}>
            <img className='login-box' src='' alt='회원증' onClick={e => this.openLoginBox(e)} />
          </div>
          <div className='part active' onMouseEnter={e => this.partIn(e)}>
            <span className='guide-login'>&lt; 로그인</span>
            <span className='guide-join'>회원가입 &gt;</span>
            <img className='security' src='' alt='silhouette' onClick={e => this.talkToSecurity(e)} />
          </div>
          <div className='part' onMouseEnter={e => this.partIn(e)}>
            <img className='join-box' src='' alt='주민등록증' onClick={e => this.openJoinBox(e)}></img>
          </div>
        </div>
        <Join show={this.state.show} jump={this.jumpCallback} showCallback={this.showCallback} />
        <Login show={this.state.show} jump={this.jumpCallback} showCallback={this.showCallback} />
      </div>
    )
  }
}

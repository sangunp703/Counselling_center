import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../style/css/main.css'
import request from 'superagent'
import Menu from './component/menu'
import Glass from './component/glass'
import Write from './component/write'
import Reply from './component/reply'
import Talk from './component/talk'

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jump: '',
      show: 'none'
    }
    this.showCallback = this.showCallback.bind(this)
    this.jumpCallback = this.jumpCallback.bind(this)
  }

  componentDidMount() {
    // 입장시 문이 열리는 애니메이션 시작
    this.openDoor()
    // 세션 체크하여 승인되지 못하면 이전페이지로 이동
    request
      .get('/api/check')
      .query({
        id: window.sessionStorage.id,
        token: window.sessionStorage.token
      })
      .end((err, res) => {
        if (err) {
          alert('세션이 만료되었습니다.')
          this.setState({ jump: '/check' })
          return
        }
        if (res.body.msg === 'denied') {
          alert('세션이 만료되었습니다.')
          this.setState({ jump: '/check' })
          return
        }
      })
  }

  showCallback(showData) {
    this.setState({
      show: showData
    })
  }

  jumpCallback(jumpData) {
    this.setState({
      jump: jumpData
    })
  }

  openMenuBox(e) {
    this.setState({ show: 'menu' })
  }

  openTalkBox(e) {
    this.setState({ show: 'talk' })
  }

  openDoor() {
    const left_door = document.querySelector('.left-door')
    const right_door = document.querySelector('.right-door')
    left_door.style.width = '0vw'
    right_door.style.width = '0vw'
  }

  logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
      // 세션 내용 제거후 첫 페이지로 이동
      window.sessionStorage.removeItem('id')
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('type')
      window.sessionStorage.removeItem('reply_num')
      this.setState({ jump: '/intro' })
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
        <img className='bartender' src='' alt='bartender' onClick={e => this.openTalkBox(e)} />
        <img className='table' src='' alt='table'></img>
        <div className='menu-img' onClick={e => this.openMenuBox(e)}>
          <span>메 뉴</span>
        </div>
        <img className='logout' src='' alt='exit' onClick={e => this.logout(e)} />
        <Menu jump={this.jumpCallback} show={this.state.show} showCallback={this.showCallback} />
        <Glass show={this.state.show} showCallback={this.showCallback} />
        <Write jump={this.jumpCallback} show={this.state.show} showCallback={this.showCallback} />
        <Reply jump={this.jumpCallback} show={this.state.show} showCallback={this.showCallback} />
        <Talk show={this.state.show} showCallback={this.showCallback} />
      </div>
    )
  }
}

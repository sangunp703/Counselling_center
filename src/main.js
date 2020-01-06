import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../style/css/main.css'
import Menu from './component/menu'
import request from 'superagent'

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jump: '',
      show: 'none'
    }
    this.showCallback = this.showCallback.bind(this)
  }

  componentDidMount() {
    request
      .get('/api/check')
      .query({
        id: window.sessionStorage.id,
        token: window.sessionStorage.token
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.msg)
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

  openMenuBox(e) {
    this.setState({ show: 'menu' })
  }

  render() {
    if (this.state.jump) {
      return <Redirect to={this.state.jump} />
    }
    return (
      <div className='main-container'>
        <div className='layout-left'></div>
        <div className='layout-right'></div>
        <img className='bartender' src='' alt='bartender' />
        <img className='table' src='' alt='table'></img>
        <div className='menu' onClick={e => this.openMenuBox(e)}>
          메 뉴
        </div>
        <Menu show={this.state.show} showCallback={this.showCallback} />
      </div>
    )
  }
}

import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../style/css/intro.css'

export default class Intro extends Component {
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
        <div className='intro-box'>
          <div className='title' onClick={e => this.enter(e)}>
            <span>술</span>
            <span>이</span>
            <br />
            <span>그</span>
            <span>대</span>
            <span>를</span>
            <br />
            <span>구</span>
            <span>원</span>
            <span>하</span>
            <span>리</span>
            <span>라</span>
          </div>
          <div>
            <img class="bottle-img" />
          </div>
        </div>
      </div>
    )
  }
}

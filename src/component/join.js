import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../../style/css/join.css'

export default class Join extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jump: ''
    }
  }

  componentDidUpdate() {
    if (this.props.show) {
      document.querySelector('.join-container').style.display = 'block'
    }
  }

  subscription(e) {
    const applyStyle = document.querySelector('.apply-after').style

    applyStyle.opacity = '1'
    applyStyle.bottom = '0%'
    setTimeout(() => {
      this.setState({ jump: '/intro' })
    }, 1500)
  }

  closeBox(e) {
    e.currentTarget.parentNode.style.display = 'none'
  }

  render() {
    if (this.state.jump) {
      return <Redirect to={this.state.jump} />
    }
    return (
      <div className='join-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='content'>
          <form className='info'>
            <h1>주민등록증</h1>
            <input type='text' />
            <span>(한자)</span>
            <input type='text' />
            <span>-</span>
            <input type='password' />
            <input type='email' />
          </form>
          <img className='profile' />
          <img className='apply' onClick={e => this.subscription(e)} />
          <img className='apply-after' />
        </div>
      </div>
    )
  }
}

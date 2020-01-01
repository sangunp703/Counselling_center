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

  deny(element, e) {
    const apply = e.currentTarget.parentNode.querySelector('.apply').style
    const notice = e.currentTarget.parentNode.querySelector('.notice')
    notice.style.display = 'block'

    if (element === 'name') {
      notice.innerHTML = '이름을 입력하세요'
    } else if (element === 'id') {
      notice.innerHTML = '주민등록번호를 입력하세요'
    } else {
      notice.innerHTML = '이메일을 입력하세요'
    }
    apply.left = '48%'
    setTimeout(() => {
      apply.left = '52%'
      setTimeout(() => {
        apply.left = '50%'
      }, 100)
    }, 100)
  }

  subscription(e) {
    const form = e.currentTarget.parentNode
    const name = form.querySelector('.name').value
    if (name === '') {
      this.deny('name', e)
      return
    }
    const front = form.querySelector('.front').value
    const back = form.querySelector('.back').value
    if (front === '' || back === '' || front.length !== 6 || back.length !== 7) {
      this.deny('id', e)
      return
    }
    const email = form.querySelector('.email').value
    if (email === '' || !email.includes('@')) {
      this.deny('email', e)
      return
    }

    const id = front + '-' + back
    console.log(name + id + email)

    const applyStyle = document.querySelector('.apply-after').style

    applyStyle.zIndex = '1'
    applyStyle.opacity = '1'
    applyStyle.bottom = '0%'
    setTimeout(() => {
      this.props.jump('/intro')
    }, 1500)
  }

  closeBox(e) {
    e.currentTarget.parentNode.style.display = 'none'
  }

  render() {
    return (
      <div className='join-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='content'>
          <form className='info'>
            <h1>주민등록증</h1>
            <input type='text' className='name' placeholder='이름' minLength='1' />
            <div>
              <input type='text' className='front' placeholder='주민등록번호 앞' minLength='6' maxLength='6' />
              <span>-</span>
              <input type='password' className='back' placeholder='주민등록번호 뒤' minLength='7' maxLength='7' />
            </div>
            <input type='email' className='email' placeholder='이메일' minLength='1' />
          </form>
          <img className='profile' />
          <img className='apply' onClick={e => this.subscription(e)} />
          <img className='apply-after' />
          <div className='notice'></div>
        </div>
      </div>
    )
  }
}

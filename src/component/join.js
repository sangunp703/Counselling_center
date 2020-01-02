import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../../style/css/join.css'
import request from 'superagent'

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

    if (element === 'id') {
      notice.innerHTML = '아이디를 입력하세요'
    } else if (element === 'password') {
      notice.innerHTML = '비밀번호를 입력하세요'
    } else if (element === 'mismatch') {
      notice.innerHTML = '비밀번호가 서로 다릅니다'
    } else {
      notice.innerHTML = '올바른 이메일을 입력하세요'
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
    const content = e.currentTarget.parentNode
    const id = content.querySelector('.id').value
    if (id === '') {
      this.deny('id', e)
      return
    }
    const pw = content.querySelector('.pw').value
    const pwCheck = content.querySelector('.pwCheck').value
    if (pw === '') {
      this.deny('password', e)
      return
    }
    if (pw !== pwCheck) {
      this.deny('mismatch', e)
      return
    }
    const email = content.querySelector('.email').value
    if (email === '' || !email.includes('@')) {
      this.deny('email', e)
      return
    }

    const notice = content.querySelector('.notice')
    notice.style.display = 'none'
    const applyStyle = content.querySelector('.apply-after').style

    applyStyle.zIndex = '1'
    applyStyle.opacity = '1'
    applyStyle.bottom = '0%'

    request
      .post('/api/join')
      .query({
        id: id,
        pw: pw,
        email: email
      })
      .end((err, res) => {
        if (err) {
          return
        }
        console.log(res.body.result)
      })

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
            <input type='text' className='id' placeholder='ID' minLength='1' />
            <div>
              <input type='password' className='pw' placeholder='비밀번호' minLength='1' />
              <span>-</span>
              <input type='password' className='pwCheck' placeholder='비밀번호 확인' minLength='1' />
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

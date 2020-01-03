import React, { Component } from 'react'
import '../../style/css/login.css'
import request from 'superagent'

export default class Login extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    if (this.props.show === 'login') {
      document.querySelector('.login-container').style.display = 'block'
    }
  }

  closeBox(e) {
    this.props.showCallback('none')
    e.currentTarget.parentNode.style.display = 'none'
  }

  deny(element, e) {
    const apply = e.querySelector('.apply').style
    const notice = e.querySelector('.notice')
    notice.style.display = 'block'

    if (element === 'id') {
      notice.innerHTML = '아이디를 입력하세요'
    } else if (element === 'password') {
      notice.innerHTML = '비밀번호를 입력하세요'
    } else if (element === 'not exist') {
      notice.innerHTML = '회원정보가 틀립니다'
    }
    apply.right = '7%'
    setTimeout(() => {
      apply.right = '3%'
      setTimeout(() => {
        apply.right = '5%'
      }, 100)
    }, 100)
  }

  login(e) {
    const content = e.currentTarget.parentNode
    const id = content.querySelector('.id').value
    if (id === '') {
      this.deny('id', content)
      return
    }
    const pw = content.querySelector('.pw').value
    if (pw === '') {
      this.deny('password', content)
      return
    }

    request
      .get('/api/login')
      .query({
        id: id,
        pw: pw
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body.msg)
          return
        }
        if (res.body.msg === 'not exist') {
          this.deny('not exist', content)
          return
        } else {
          const notice = content.querySelector('.notice')
          notice.style.display = 'none'
          const applyStyle = content.querySelector('.apply-after').style

          applyStyle.zIndex = '1'
          applyStyle.opacity = '1'
          applyStyle.bottom = '5%'

          setTimeout(() => {
            this.props.jump('/main')
          }, 1500)
        }
      })
  }

  render() {
    return (
      <div className='login-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='content'>
          <form className='info'>
            <input type='text' className='id' placeholder='ID' minLength='1' />
            <input type='password' className='pw' placeholder='비밀번호' minLength='1' />
          </form>
          <img className='apply' onClick={e => this.login(e)} />
          <img className='apply-after' />
          <div className='notice'></div>
          {/* <div className='name-temp'>홍길동</div>
          <div className='no-temp'>123456</div>
          <img className='stamp-temp' src='' alt='stamp' />  */}
        </div>
      </div>
    )
  }
}

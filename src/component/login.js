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
    } else {
      document.querySelector('.login-container').style.display = 'none'
    }
  }

  closeBox(e) {
    this.props.showCallback('none')
  }

  deny(element) {
    const login_container = document.querySelector('.login-container')
    const apply = login_container.querySelector('.apply').style
    const notice = login_container.querySelector('.notice')
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
    const login_container = document.querySelector('.login-container')
    const id = login_container.querySelector('.id').value
    if (id === '') {
      this.deny('id')
      return
    }
    const pw = login_container.querySelector('.pw').value
    if (pw === '') {
      this.deny('password')
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
          return
        }
        if (res.body.msg === 'not exist') {
          this.deny('not exist')
          return
        } else {
          window.sessionStorage['id'] = id
          window.sessionStorage['token'] = res.body.token

          const notice = login_container.querySelector('.notice')
          notice.style.display = 'none'
          const applyStyle = login_container.querySelector('.apply-after').style

          applyStyle.zIndex = '1'
          applyStyle.opacity = '1'
          applyStyle.bottom = '5%'

          setTimeout(() => {
            this.props.jump('/main')
          }, 1200)
        }
      })
  }

  loginEnter(e) {
    if (e.key === 'Enter') {
      this.login(e)
    }
  }

  render() {
    return (
      <div className='login-container' onKeyPress={e => this.loginEnter(e)}>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='content'>
          <form className='info'>
            <input type='text' className='id' placeholder='ID' minLength='1' />
            <input type='password' className='pw' placeholder='비밀번호' minLength='1' />
          </form>
          <img className='apply' onClick={e => this.login(e)} />
          <img className='apply-after' />
          <div className='notice'></div>
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react'
import '../../style/css/join.css'
import request from 'superagent'

export default class Join extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    if (this.props.show === 'join') {
      document.querySelector('.join-container').style.display = 'block'
    } else {
      document.querySelector('.join-container').style.display = 'none'
    }
  }

  closeBox(e) {
    this.props.showCallback('none')
  }

  deny(element) {
    const join_container = document.querySelector('.join-container')
    const applyStyle = join_container.querySelector('.apply').style
    const notice = join_container.querySelector('.notice')

    if (element === 'id') {
      notice.innerHTML = '올바른 아이디를 입력하세요'
    } else if (element === 'exist') {
      notice.innerHTML = '이미 존재하는 아이디입니다'
    } else if (element === 'password') {
      notice.innerHTML = '올바른 비밀번호를 입력하세요'
    } else if (element === 'mismatch') {
      notice.innerHTML = '비밀번호가 서로 다릅니다'
    } else if (element === 'email') {
      notice.innerHTML = '올바른 이메일을 입력하세요'
    }
    // 양 옆으로 흔들리는 애니메이션
    applyStyle.left = '48%'
    setTimeout(() => {
      applyStyle.left = '52%'
      setTimeout(() => {
        applyStyle.left = '50%'
      }, 100)
    }, 100)
  }

  subscription(e) {
    const join_container = document.querySelector('.join-container')
    // 각 요소가 형식에 맞는지 확인
    const id = join_container.querySelector('.id').value
    if (!id.match(/^[a-zA-Z0-9]{6,20}$/)) {
      this.deny('id')
      return
    }
    const pw = join_container.querySelector('.pw').value
    if (!pw.match(/^.{6,20}$/)) {
      this.deny('password')
      return
    }
    const pwCheck = join_container.querySelector('.pwCheck').value
    if (pw !== pwCheck) {
      this.deny('mismatch')
      return
    }
    const email = join_container.querySelector('.email').value
    if (!email.match(/^[a-z0-9_+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/)) {
      this.deny('email')
      return
    }

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
        if (res.body.msg === 'already exist') {
          this.deny('exist')
          return
        } else {
          // 세션에 아이디와 토큰 저장
          window.sessionStorage['id'] = id
          window.sessionStorage['token'] = res.body.token

          const notice = join_container.querySelector('.notice')
          notice.innerHTML = ''
          const applyStyle = join_container.querySelector('.apply-after').style

          applyStyle.zIndex = '1'
          applyStyle.opacity = '1'
          applyStyle.bottom = '0%'

          // 트랜지션 종료 후 점프 값 전달
          setTimeout(() => {
            this.props.jump('/main')
          }, 1200)
        }
      })
  }

  subscriptionEnter(e) {
    // Enter키가 눌렸을 경우 subscription 이벤트 실행
    if (e.key === 'Enter') {
      this.subscription(e)
    }
  }

  inputChange(e) {
    const join_container = document.querySelector('.join-container')
    const notice = join_container.querySelector('.notice')
    const value = e.currentTarget.value
    // 값이 바뀔 때마다 형식에 맞는지 확인
    if (e.currentTarget.classList.contains('id')) {
      if (!value.match(/^[a-zA-Z0-9]{6,20}$/)) {
        notice.innerHTML = '아이디는 6자 이상 20자 이하의 영어와 숫자로 구성됩니다'
      } else {
        notice.innerHTML = ''
      }
    } else if (e.currentTarget.classList.contains('pw')) {
      if (!value.match(/^.{6,20}$/)) {
        notice.innerHTML = '비밀번호는 6자 이상 20자 이하입니다'
      } else {
        notice.innerHTML = ''
      }
    } else if (e.currentTarget.classList.contains('pwCheck')) {
      const pw = join_container.querySelector('.pw')
      if (pw.value !== value) {
        notice.innerHTML = '비밀번호가 서로 다릅니다'
      } else {
        notice.innerHTML = ''
      }
    } else if (e.currentTarget.classList.contains('email')) {
      if (!value.match(/^[a-z0-9_+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/)) {
        notice.innerHTML = '올바른 이메일을 입력하세요'
      } else {
        notice.innerHTML = ''
      }
    } else {
      notice.innerHTML = ''
    }
  }

  render() {
    return (
      <div className='join-container' onKeyPress={e => this.subscriptionEnter(e)}>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='content'>
          <form className='info'>
            <h1>주민등록증</h1>
            <input type='text' className='id' placeholder='ID' minLength='1' onChange={e => this.inputChange(e)} />
            <div>
              <input type='password' className='pw' placeholder='비밀번호' minLength='1' onChange={e => this.inputChange(e)} />
              <span>-</span>
              <input type='password' className='pwCheck' placeholder='비밀번호 확인' minLength='1' onChange={e => this.inputChange(e)} />
            </div>
            <input type='email' className='email' placeholder='이메일' minLength='1' onChange={e => this.inputChange(e)} />
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

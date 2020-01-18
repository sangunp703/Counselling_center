import React, { Component } from 'react'
import '../../style/css/reply.css'
import request from 'superagent'

export default class Reply extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    const reply_container = document.querySelector('.reply-container')

    if (this.props.show === 'reply') {
      reply_container.style.display = 'block'
      const arrow_box = reply_container.querySelector('.arrow-box')
      const arrow = reply_container.querySelector('.arrow')
      arrow_box.addEventListener('click', this.worryToggle)
      arrow.src = '/assets/image/down.png'
      // 글과 댓글 읽어오기
      this.getReply()
      this.getWorry()
    } else {
      reply_container.style.display = 'none'
    }
  }

  getReply() {
    const reply_container = document.querySelector('.reply-container')
    const reply = reply_container.querySelector('.reply')

    request
      .get('/api/getReply')
      .query({
        id: window.sessionStorage.id,
        type: window.sessionStorage.type,
        index: window.sessionStorage.reply_index
      })
      .end((err, res) => {
        if (err) {
          return
        }
        // 댓글 출력
        if (res.body.msg === 'complete') {
          reply.innerHTML = res.body.reply.reply
        }
      })
  }

  getWorry() {
    const reply_container = document.querySelector('.reply-container')
    const worry_content = reply_container.querySelector('.worry-content')
    const title = worry_content.querySelector('.title')
    const story = worry_content.querySelector('.story')

    request
      .get('/api/getContent')
      .query({
        id: window.sessionStorage.id,
        type: window.sessionStorage.type
      })
      .end((err, res) => {
        if (err) {
          return
        }
        // 제목과 글 출력
        if (res.body.msg === 'exist') {
          title.innerHTML = res.body.title
          story.innerHTML = res.body.story
        } else {
          title.innerHTML = ''
          story.innerHTML = ''
        }
      })
  }

  closeBox() {
    const reply_container = document.querySelector('.reply-container')
    const worry = reply_container.querySelector('.worry')
    // 컴포넌트 종료 전 추가된 클래스 제거
    if (worry.classList.contains('bottom')) {
      const worry_content = worry.querySelector('.worry-content')
      worry.classList.remove('bottom')
      worry_content.style.display = 'none'
    }
    this.props.showCallback('glass')
  }

  worryToggle() {
    const reply_container = document.querySelector('.reply-container')
    const worry = reply_container.querySelector('.worry')
    const worry_content = worry.querySelector('.worry-content')
    const arrow_box = reply_container.querySelector('.arrow-box')
    const arrow = reply_container.querySelector('.arrow')

    if (worry.classList.contains('bottom')) {
      worry_content.style.display = 'none'
      worry.classList.toggle('bottom')
      arrow.src = '/assets/image/down.png'
    } else {
      arrow.src = '/assets/image/up.png'
      setTimeout(() => {
        worry_content.style.display = 'block'
      }, 1000)
      worry.classList.toggle('bottom')
    }

    // 원래 글이 열리고 닫히는 동안은 이벤트 비활성화
    arrow_box.removeEventListener('click', this.worryToggle)
    arrow_box.style.cursor = 'default'
    setTimeout(() => {
      arrow_box.addEventListener('click', this.worryToggle)
      arrow_box.style.cursor = 'pointer'
    }, 1000)
  }

  deleteReply() {
    if (confirm('댓글을 삭제하시겠습니까?')) {
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
            this.props.jump('/check')
            return
          }
          if (res.body.msg === 'denied') {
            alert('세션이 만료되었습니다.')
            this.props.jump('/check')
            return
          }
          request
            .post('/api/deleteReply')
            .query({
              author: window.sessionStorage.id,
              type: window.sessionStorage.type,
              index: window.sessionStorage.reply_index
            })
            .end((err, res) => {
              if (err) {
                return
              }
              this.closeBox()
            })
        })
    }
  }

  mouseover(e) {
    const reply_container = document.querySelector('.reply-container')
    const worry = reply_container.querySelector('.worry')
    const arrow = reply_container.querySelector('.arrow')
    if (worry.classList.contains('bottom')) {
      arrow.src = '/assets/image/up-white.png'
    } else {
      arrow.src = '/assets/image/down-white.png'
    }
  }

  mouseout(e) {
    const reply_container = document.querySelector('.reply-container')
    const worry = reply_container.querySelector('.worry')
    const arrow = reply_container.querySelector('.arrow')
    if (worry.classList.contains('bottom')) {
      arrow.src = '/assets/image/up.png'
    } else {
      arrow.src = '/assets/image/down.png'
    }
  }

  prevReply() {
    const index = parseInt(window.sessionStorage.reply_index, 10)
    if (index === 1) {
      window.sessionStorage.reply_index = window.sessionStorage.reply_num
    } else {
      window.sessionStorage.reply_index = index - 1
    }
    this.getReply()
  }

  nextReply() {
    const index = parseInt(window.sessionStorage.reply_index, 10)
    if (window.sessionStorage.reply_index === window.sessionStorage.reply_num) {
      window.sessionStorage.reply_index = 1
    } else {
      window.sessionStorage.reply_index = index + 1
    }
    this.getReply()
  }

  render() {
    return (
      <div className='reply-container'>
        <div className='layout' onClick={e => this.closeBox()}></div>
        <div className='content'>
          <div className='reply-box'>
            <pre className='reply'></pre>
            <button className='prev-btn' type='button' onClick={e => this.prevReply()}>
              이전 댓글
            </button>
            <button className='next-btn' type='button' onClick={e => this.nextReply()}>
              다음 댓글
            </button>
            <button className='delete-btn' type='button' onClick={e => this.deleteReply()}>
              댓글 삭제
            </button>
          </div>
          <div className='worry'>
            <div className='worry-content'>
              <h2 className='title'></h2>
              <pre className='story'></pre>
            </div>
          </div>
          <div className='arrow-box' onMouseOver={e => this.mouseover(e)} onMouseOut={e => this.mouseout(e)}>
            <img className='arrow' src='' alt='arrow' />
          </div>
        </div>
      </div>
    )
  }
}

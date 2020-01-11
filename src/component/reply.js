import React, { Component } from 'react'
import '../../style/css/reply.css'
import request from 'superagent'

export default class Reply extends Component {
  constructor(props) {
    super(props)
  }

  closeBox() {
    const worry = document.querySelector('.worry')
    // 글 상자 초기화
    if (worry.classList.contains('bottom')) {
      this.worryToggle()
    }
    this.props.showCallback('glass')
  }

  componentDidUpdate() {
    if (this.props.show === 'reply') {
      document.querySelector('.reply-container').style.display = 'block'
      const reply_container = document.querySelector('.reply-container')
      const reply = reply_container.querySelector('.reply')
      const arrow_box = reply_container.querySelector('.arrow-box')
      arrow_box.addEventListener('click', this.worryToggle)
      request
        .get('/api/getReply')
        .query({
          id: window.sessionStorage.id,
          type: window.sessionStorage.type,
          num: window.sessionStorage.reply_num
        })
        .end((err, res) => {
          if (err) {
            return
          } else {
            reply.innerHTML = res.body.reply
          }
        })
    } else {
      document.querySelector('.reply-container').style.display = 'none'
    }
  }

  worryToggle() {
    const reply_container = document.querySelector('.reply-container')
    const worry = reply_container.querySelector('.worry')
    const worry_content = worry.querySelector('.worry-content')
    const arrow_box = reply_container.querySelector('.arrow-box')
    if (worry.classList.contains('bottom')) {
      worry_content.style.display = 'none'
      worry.classList.toggle('bottom')
    } else {
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
          } else {
            title.innerHTML = res.body.title
            story.innerHTML = res.body.story
          }
        })
      setTimeout(() => {
        worry_content.style.display = 'block'
      }, 1000)
      worry.classList.toggle('bottom')
    }
    arrow_box.removeEventListener('click', this.worryToggle)
    arrow_box.style.cursor = 'default'
    setTimeout(() => {
      arrow_box.addEventListener('click', this.worryToggle)
      arrow_box.style.cursor = 'pointer'
    }, 1000)
  }

  deleteReply() {
    request
      .post('/api/deleteReply')
      .query({
        author: window.sessionStorage.id,
        type: window.sessionStorage.type,
        index: window.sessionStorage.reply_num
      })
      .end((err, res) => {
        if (err) {
          return
        }
        this.closeBox()
      })
  }

  render() {
    return (
      <div className='reply-container'>
        <div className='layout' onClick={e => this.closeBox()}></div>
        <div className='content'>
          <div className='reply-box'>
            <pre className='reply'></pre>
            <button className='delete-btn' type='button' onClick={e => this.deleteReply()}>
              댓글 삭제
            </button>
          </div>
          <div className='worry'>
            <div className='worry-content'>
              <h2 className='title'>제 목</h2>
              <div className='story-box'>
                <pre className='story'>내 용</pre>
              </div>
            </div>
          </div>
          <div className='arrow-box'>
            <img className='arrow' src='' alt='arrow' />
          </div>
        </div>
      </div>
    )
  }
}

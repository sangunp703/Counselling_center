import React, { Component } from 'react'
import '../../style/css/talk.css'
import request from 'superagent'

export default class Talk extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: { author: '', type: '' }
    }
  }

  componentDidUpdate() {
    const talk_container = document.querySelector('.talk-container')
    if (this.props.show === 'talk') {
      talk_container.style.display = 'block'
    } else {
      talk_container.style.display = 'none'
    }
  }

  componentDidMount() {
    this.randomPick()
  }

  closeBox(e) {
    if (confirm('글 쓰기를 취소하고 나가시겠습니까?')) {
      this.props.showCallback('none')
    }
  }

  next() {
    if (confirm('다른 글을 보시겠습니까?')) {
      this.randomPick()
    }
  }

  randomPick() {
    request
      .get('/api/getRandomContent')
      .query({
        id: window.sessionStorage.id
      })
      .end((err, res) => {
        if (err) {
          return
        }
        if (res.body.msg === 'complete') {
          const talk_container = document.querySelector('.talk-container')
          const title = talk_container.querySelector('.title')
          const story = talk_container.querySelector('.story')

          title.innerHTML = res.body.title
          story.innerHTML = res.body.story
          this.setState({
            content: { author: res.body.author, type: res.body.type }
          })
        } else {
          title.innerHTML = '다른 사용자가 남긴 고민이 없습니다'
          this.setState({
            content: { author: '', type: '' }
          })
          return
        }
      })
  }

  reply() {
    const talk_container = document.querySelector('.talk-container')
    const reply = talk_container.querySelector('.reply')
    if (reply.value.length > 0) {
      if (confirm('댓글을 남기시겠습니까?')) {
        request
          .post('/api/writeReply')
          .query({
            author: this.state.content.author,
            type: this.state.content.type,
            reply: reply.value
          })
          .end((err, res) => {
            if (err) {
              return
            }
            if (res.body.msg === 'complete') {
              reply.value = ''
              this.randomPick()
            } else {
              alert('댓글을 남길 수 없습니다')
            }
          })
      }
    } else {
      alert('한 글자 이상 입력하세요')
    }
  }

  render() {
    return (
      <div className='talk-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='content'>
          <div className='worry-box'>
            <div className='title'></div>
            <pre className='story'></pre>
          </div>
        </div>
        <div className='reply-box'>
          <textarea className='reply'></textarea>
          <button className='submit' type='button' onClick={e => this.reply()}>
            상담 완료
          </button>
          <button className='change' type='button' onClick={e => this.next()}>
            다른 대화
          </button>
        </div>
      </div>
    )
  }
}

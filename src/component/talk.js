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
    this.props.showCallback('none')
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
        const talk_container = document.querySelector('.talk-container')
        const title = talk_container.querySelector('.title')
        const story = talk_container.querySelector('.story')

        title.innerHTML = res.body.title
        story.innerHTML = res.body.story
        this.setState({
          content: { author: res.body.author, type: res.body.type }
        })
      })
  }

  reply() {
    const talk_container = document.querySelector('.talk-container')
    const reply = talk_container.querySelector('.reply')
    if (reply.value !== '') {
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
          reply.value = ''
        })
    }
  }

  render() {
    return (
      <div className='talk-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='content'>
          <div className='scroll'>
            <div className='worry-box'>
              <div className='title'>title</div>
              <div className='story'>story</div>
            </div>
          </div>
          <div className='reply-box'>
            <textarea className='reply'></textarea>
            <button className='submit' type='button' onClick={e => this.reply()}>
              상담 완료
            </button>
            <button className='change' type='button' onClick={e => this.randomPick()}>
              다른 대화
            </button>
          </div>
        </div>
      </div>
    )
  }
}

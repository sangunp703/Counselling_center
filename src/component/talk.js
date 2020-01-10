import React, { Component } from 'react'
import '../../style/css/talk.css'
import request from 'superagent'

export default class Talk extends Component {
  constructor(props) {
    super(props)
  }

  closeBox(e) {
    this.props.showCallback('none')
  }

  componentDidUpdate() {
    if (this.props.show === 'talk') {
      document.querySelector('.talk-container').style.display = 'block'
      this.randomPick()
    } else {
      document.querySelector('.talk-container').style.display = 'none'
    }
  }

  randomPick() {
    request
      .get('/api/getRandomContent')
      .query({
        id: window.sessionStorage.id
      })
      .end((err, res) => {
        const talk_container = document.querySelector('.talk-container')
        const title = talk_container.querySelector('.title')
        const story = talk_container.querySelector('.story')

        title.innerHTML = res.body.title
        story.innerHTML = res.body.story
      })
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
            <button className='submit' type='button'>
              상담 완료
            </button>
            <button className='change' type='button'>
              다른 대화
            </button>
          </div>
        </div>
      </div>
    )
  }
}

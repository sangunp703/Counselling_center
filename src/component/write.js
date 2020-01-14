import React, { Component } from 'react'
import '../../style/css/write.css'
import request from 'superagent'

export default class Write extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    const write_container = document.querySelector('.write-container')
    if (this.props.show === 'write') {
      write_container.style.display = 'block'
      const title = write_container.querySelector('.title')
      const story = write_container.querySelector('.story')
      const submit = write_container.querySelector('.submit')

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
          if (res.body.msg === 'complete') {
            // 해당 컨텐츠가 있는 경우 수정 하기 이벤트
            title.value = res.body.title
            story.value = res.body.story
            submit.removeEventListener('click', this.edit.bind(this))
            submit.removeEventListener('click', this.write.bind(this))
            submit.addEventListener('click', this.edit.bind(this))
          } else {
            // 해당 컨텐츠가 없는 경우 새로 쓰기 이벤트
            submit.removeEventListener('click', this.edit.bind(this))
            submit.removeEventListener('click', this.write.bind(this))
            submit.addEventListener('click', this.write.bind(this))
          }
        })
    } else {
      write_container.style.display = 'none'
    }
  }

  closeBox() {
    this.props.showCallback('menu')
  }

  write() {
    const write_container = document.querySelector('.write-container')
    const title = write_container.querySelector('.title')
    const story = write_container.querySelector('.story')

    // 글을 적었을 때만 데이터베이스에 저장
    if (title.value.length >= 0 && story.value.length >= 0) {
      request
        .post('/api/write')
        .query({
          id: window.sessionStorage.id,
          title: title.value,
          story: story.value,
          type: window.sessionStorage.type
        })
        .end((err, res) => {
          if (err) {
            return
          }
          title.value = ''
          story.value = ''
          this.closeBox()
        })
    } else {
      // 메시지 출력
    }
  }

  edit() {
    const write_container = document.querySelector('.write-container')
    const title = write_container.querySelector('.title')
    const story = write_container.querySelector('.story')

    // 글을 적었을 때만 데이터베이스에 저장
    if (title.value.length >= 0 && story.value.length >= 0) {
      request
        .post('/api/edit')
        .query({
          id: window.sessionStorage.id,
          title: title.value,
          story: story.value,
          type: window.sessionStorage.type
        })
        .end((err, res) => {
          if (err) {
            return
          }
          title.value = ''
          story.value = ''
          this.closeBox()
        })
    } else {
      // 메시지 출력
    }
  }

  render() {
    return (
      <div className='write-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <form className='form'>
          <input className='title' type='text' placeholder='제 목' />
          <textarea className='story' placeholder='내 용'></textarea>
          <button className='submit' type='button'>
            KEEP
          </button>
        </form>
      </div>
    )
  }
}

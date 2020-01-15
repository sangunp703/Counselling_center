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
      var new_submit = submit.cloneNode(true) // 이벤트 추가하기 전 버튼요소 복사
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
            submit.addEventListener('click', this.write.bind(this, 'edit', new_submit))
          } else {
            // 해당 컨텐츠가 없는 경우 새로 쓰기 이벤트
            submit.addEventListener('click', this.write.bind(this, 'write', new_submit))
          }
        })
    } else {
      write_container.style.display = 'none'
    }
  }

  closeBox() {
    if (confirm('글 쓰기를 취소하고 나가시겠습니까?')) {
      const write_container = document.querySelector('.write-container')
      const title = write_container.querySelector('.title')
      const story = write_container.querySelector('.story')
      const notice = write_container.querySelector('.notice')
      notice.innerHTML = ''
      title.value = ''
      story.value = ''
      this.props.showCallback('menu')
    }
  }

  write(action, new_submit) {
    const write_container = document.querySelector('.write-container')
    const title = write_container.querySelector('.title')
    const story = write_container.querySelector('.story')
    const submit = write_container.querySelector('.submit')
    const notice = write_container.querySelector('.notice')

    notice.innerHTML = ''
    action = '/api/' + action

    // 글을 적었을 때만 데이터베이스에 저장
    if (title.value.length > 0 && story.value.length > 0) {
      if (confirm('글을 저장하시겠습니까?')) {
        request
          .post(action)
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
            submit.parentNode.replaceChild(new_submit, submit) // 현 버튼 요소를 이벤트 추가 전 요소로 변경하는 것으로 이벤트 삭제
            notice.innerHTML = ''
            title.value = ''
            story.value = ''
            this.props.showCallback('menu')
          })
      }
    } else {
      notice.innerHTML = '제목과 내용을 입력하세요'
    }
  }

  render() {
    return (
      <div className='write-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <form className='form'>
          <input className='title' type='text' placeholder='제 목' maxLength='20' />
          <textarea className='story' placeholder='내 용'></textarea>
          <div className='notice'></div>
          <button className='submit' type='button'>
            KEEP
          </button>
        </form>
      </div>
    )
  }
}

import React, { Component } from 'react'
import '../../style/css/write.css'
import request from 'superagent'

export default class Write extends Component {
  constructor(props) {
    super(props)
  }

  closeBox() {
    this.props.showCallback('menu')
  }

  componentDidUpdate() {
    if (this.props.show === 'write') {
      document.querySelector('.write-container').style.display = 'block'
      const write_container = document.querySelector('.write-container')
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
            title.value = res.body.title
            story.value = res.body.story
            submit.removeEventListener('click', this.edit.bind(this))
            submit.removeEventListener('click', this.write.bind(this))
            submit.addEventListener('click', this.edit.bind(this))
          } else {
            submit.removeEventListener('click', this.edit.bind(this))
            submit.removeEventListener('click', this.write.bind(this))
            submit.addEventListener('click', this.write.bind(this))
          }
        })
    } else {
      document.querySelector('.write-container').style.display = 'none'
    }
  }

  write() {
    const write_container = document.querySelector('.write-container')
    const title = write_container.querySelector('.title')
    const story = write_container.querySelector('.story')

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
  }

  edit() {
    const write_container = document.querySelector('.write-container')
    const title = write_container.querySelector('.title')
    const story = write_container.querySelector('.story')

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

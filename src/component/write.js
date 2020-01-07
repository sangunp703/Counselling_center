import React, { Component } from 'react'
import '../../style/css/write.css'
import request from 'superagent'

export default class Write extends Component {
  constructor(props) {
    super(props)
  }

  closeBox(e) {
    this.props.showCallback('menu')
  }

  componentDidUpdate() {
    if (this.props.show === 'write') {
      document.querySelector('.write-container').style.display = 'block'
    } else {
      document.querySelector('.write-container').style.display = 'none'
    }
  }

  write(e) {
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
        this.closeBox(e)
      })
  }

  render() {
    return (
      <div className='write-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <form className='form'>
          <input className='title' type='text' placeholder='제 목' />
          <textarea className='story' placeholder='내 용'></textarea>
          <button className='submit' type='button' onClick={e => this.write(e)}>
            KEEP
          </button>
        </form>
      </div>
    )
  }
}

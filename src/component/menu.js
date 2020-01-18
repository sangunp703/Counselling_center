import React, { Component } from 'react'
import '../../style/css/menu.css'
import request from 'superagent'

const alcohols = ['soju', 'beer', 'makgeolli', 'wine', 'champagne', 'whiskey']

export default class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
    this.showWrite = this.showWrite.bind(this)
    this.showGlass = this.showGlass.bind(this)
  }

  componentDidUpdate() {
    const menu_container = document.querySelector('.menu-container')
    if (this.props.show === 'menu') {
      menu_container.style.display = 'block'
      const type = menu_container.querySelector('.type')
      const bottle = menu_container.querySelector('.bottle')
      const glass = menu_container.querySelector('.glass')
      const content = menu_container.querySelector('.content')
      const worry = menu_container.querySelector('.worry')
      const reply_count = menu_container.querySelector('.reply-count')
      const btn_box = menu_container.querySelector('.btn-box')
      const title = worry.querySelector('.title')
      const story = worry.querySelector('.story')
      const alcoholsType = ['소 주', '맥 주', '막 걸 리', '와 인', '샴 페 인', '위 스 키']

      type.innerHTML = alcoholsType[this.state.index]
      bottle.src = '/assets/image/' + alcohols[this.state.index] + '.png'
      glass.src = '/assets/image/' + alcohols[this.state.index] + '-glass.png'

      request
        .get('/api/getContent')
        .query({
          id: window.sessionStorage.id,
          type: alcohols[this.state.index]
        })
        .end((err, res) => {
          if (err) {
            return
          }
          if (res.body.msg === 'not exist') {
            // 해당 술에 글이 없으면 글 상자 안보이게하고 글 쓰기 이벤트 연결
            worry.style.display = 'none'
            reply_count.style.display = 'none'
            btn_box.style.display = 'none'
            content.removeEventListener('click', this.showGlass)
            content.removeEventListener('click', this.showWrite)
            content.addEventListener('click', this.showWrite)
          } else {
            // 해당 술에 글이 있으면 내용 출력하고 댓글 선택 이벤트 연결
            worry.style.display = 'block'
            reply_count.style.display = 'block'
            btn_box.style.display = 'block'
            reply_count.innerHTML = 'X ' + res.body.reply_count
            title.innerHTML = res.body.title
            story.innerHTML = res.body.story
            content.removeEventListener('click', this.showGlass)
            content.removeEventListener('click', this.showWrite)
            content.addEventListener('click', this.showGlass)
          }
        })
    } else {
      menu_container.style.display = 'none'
    }
  }

  showWrite() {
    window.sessionStorage.type = alcohols[this.state.index]
    this.props.showCallback('write')
  }

  showGlass() {
    window.sessionStorage.type = alcohols[this.state.index]
    this.props.showCallback('glass')
  }

  closeBox(e) {
    this.props.showCallback('none')
  }

  previousMenu(e) {
    if (this.state.index === 0) {
      this.setState({
        index: 5
      })
    } else {
      this.setState({
        index: this.state.index - 1
      })
    }
  }

  nextMenu(e) {
    if (this.state.index === 5) {
      this.setState({
        index: 0
      })
    } else {
      this.setState({
        index: this.state.index + 1
      })
    }
  }

  deleteContent() {
    if (confirm('글을 삭제하시겠습니까?')) {
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
            .post('/api/deleteContent')
            .query({
              author: window.sessionStorage.id,
              type: alcohols[this.state.index]
            })
            .end((err, res) => {
              if (err) {
                return
              }
              if (res.body.msg === 'complete') {
                // 다시 렌더링 하기
                this.setState({
                  index: this.state.index
                })
              }
            })
        })
    }
  }

  render() {
    return (
      <div className='menu-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='background'>
          <div className='menu'>
            <h1 className='type'></h1>
            <div className='content'>
              <div className='alcohol'>
                <img className='bottle' src='' alt='bottle' />
                <img className='glass' src='' alt='glass' />
                <span className='reply-count'>X 0</span>
              </div>
              <div className='worry'>
                <h2 className='title'></h2>
                <pre className='story'></pre>
              </div>
            </div>
            <div className='btn-box'>
              <button className='edit-btn' type='button' onClick={e => this.showWrite(e)}>
                글 수정
              </button>
              <button className='delete-btn' type='button' onClick={e => this.deleteContent(e)}>
                글 삭제
              </button>
            </div>
            <img className='arrow-back' src='' alt='previous' onClick={e => this.previousMenu(e)} />
            <img className='arrow-next' src='' alt='next' onClick={e => this.nextMenu(e)} />
          </div>
        </div>
      </div>
    )
  }
}

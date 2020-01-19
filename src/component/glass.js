import React, { Component } from 'react'
import '../../style/css/glass.css'
import request from 'superagent'

export default class Write extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    const glass_container = document.querySelector('.glass-container')
    const grid = glass_container.querySelector('.grid')
    if (this.props.show === 'glass') {
      this.make10Div()
      glass_container.style.display = 'block'
    } else {
      // 현재 보여지는 컴포넌트가 glass가 아니면 불러온 댓글 목록 초기화
      while (grid.hasChildNodes()) {
        grid.removeChild(grid.firstChild)
      }
      glass_container.style.display = 'none'
    }
  }

  glassSelect(index, num) {
    // 세션에 총 댓글 수와 현재 댓글 인덱스 저장
    window.sessionStorage.reply_num = num
    window.sessionStorage.reply_index = index
    this.props.showCallback('reply')
  }

  closeBox(e) {
    this.props.showCallback('menu')
  }

  createDiv(index, num, watched) {
    const div = document.createElement('div')
    const img = document.createElement('img')
    // 해당 술잔 이미지 배경으로 설정
    img.src = '/assets/image/' + window.sessionStorage.type + '-glass.png'
    const span = document.createElement('span')
    span.innerHTML = index
    div.appendChild(img)
    div.appendChild(span)
    // 댓글 선택 이벤트 연결
    div.addEventListener('click', this.glassSelect.bind(this, index, num))
    // 이미 본 댓글의 경우 어둡게 표현
    if (watched) {
      div.classList.add('watched')
    }

    return div
  }

  make10Div() {
    request
      .get('/api/getAllReply')
      .query({
        id: window.sessionStorage.id,
        type: window.sessionStorage.type
      })
      .end((err, res) => {
        if (err) {
          return
        }
        if (res.body.msg === 'complete') {
          const glass_container = document.querySelector('.glass-container')
          const grid = glass_container.querySelector('.grid')
          const none = glass_container.querySelector('.none')
          const count = grid.childElementCount

          // 10개씩 불러오되 댓글이 10개 이하일 경우 그 수만큼만 출력
          const x = res.body.reply.length >= count + 10 ? 10 : res.body.reply.length - count
          for (let i = 0; i < x; i++) {
            grid.appendChild(this.createDiv(count + i + 1, res.body.reply.length, res.body.reply[count + i].watched))
          }
          // 댓글이 없을 경우 안내 메시지 보이게
          if (!grid.hasChildNodes()) {
            none.style.display = 'block'
          } else {
            none.style.display = 'none'
          }
        }
      })
  }

  scrollHandle(e) {
    var scrollT = e.currentTarget.scrollTop
    var scrollH = e.currentTarget.clientHeight
    const grid = e.currentTarget.querySelector('.grid')
    var contentH = grid.clientHeight
    // 스크롤바가 가장 아래 쪽에 위치할 때 새로운 댓글 불러오기
    if (scrollT + scrollH + 1 >= contentH) {
      this.make10Div()
    }
  }

  render() {
    return (
      <div className='glass-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='content'>
          <div className='scroll' onScroll={e => this.scrollHandle(e)}>
            <div className='none'>댓글이 없습니다</div>
            <div className='grid'></div>
          </div>
          <div className='scroll-frame'>
            <div className='scroll-img'></div>
          </div>
        </div>
      </div>
    )
  }
}

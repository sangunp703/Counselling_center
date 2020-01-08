import React, { Component } from 'react'
import '../../style/css/glass.css'
import request from 'superagent'

export default class Write extends Component {
  constructor(props) {
    super(props)
  }

  closeBox(e) {
    this.props.showCallback('menu')
  }

  componentDidUpdate() {
    if (this.props.show === 'glass') {
      this.make10Div()
      document.querySelector('.glass-container').style.display = 'block'
    } else {
      const glass_container = document.querySelector('.glass-container')
      const grid = glass_container.querySelector('.grid')
      while (grid.hasChildNodes()) {
        grid.removeChild(grid.firstChild)
      }
      document.querySelector('.glass-container').style.display = 'none'
    }
  }

  createDiv(num) {
    const div = document.createElement('div')
    const img = document.createElement('img')
    img.src = '/assets/image/' + window.sessionStorage.type + '-glass.png'
    const span = document.createElement('span')
    span.innerHTML = num
    div.appendChild(img)
    div.appendChild(span)

    return div
  }

  make10Div() {
    const divs = []
    request
      .get('/api/getReply')
      .query({
        id: window.sessionStorage.id,
        type: window.sessionStorage.type
      })
      .end((err, res) => {
        if (err) {
          return
        } else {
          const glass_container = document.querySelector('.glass-container')
          const grid = glass_container.querySelector('.grid')
          const count = grid.childElementCount
          // 5개씩 불러오되 댓글이 5개 이하일 경우 그 수만 큼만 출력
          const x = res.body.count >= count + 10 ? 10 : res.body.count - count
          for (let i = 0; i < x; i++) {
            divs.push(this.createDiv(count + i + 1))
          }
          for (var i = 0; i < divs.length; i++) {
            grid.appendChild(divs[i])
          }
        }
      })
  }

  scrollHandle(e) {
    var scrollT = e.currentTarget.scrollTop // 스크롤바의 상단위치
    var scrollH = e.currentTarget.clientHeight // 스크롤바를 갖는 div의 높이
    const grid = e.currentTarget.querySelector('.grid')
    var contentH = grid.clientHeight // 문서 전체 내용을 갖는 div의 높이
    if (scrollT + scrollH + 1 >= contentH) {
      // 스크롤바가 아래 쪽에 위치할 때
      this.make10Div()
    }
  }

  render() {
    return (
      <div className='glass-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='content'>
          <div className='scroll' onScroll={e => this.scrollHandle(e)}>
            <div className='grid'></div>
          </div>
          <div className='scroll-img'></div>
        </div>
      </div>
    )
  }
}

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

  showWrite() {
    window.sessionStorage.type = alcohols[this.state.index]
    this.props.showCallback('write')
  }

  showGlass() {
    window.sessionStorage.type = alcohols[this.state.index]
    this.props.showCallback('glass')
  }

  componentDidUpdate() {
    if (this.props.show === 'menu') {
      document.querySelector('.menu-container').style.display = 'block'
    } else {
      document.querySelector('.menu-container').style.display = 'none'
    }
    const menu_container = document.querySelector('.menu-container')
    const type = menu_container.querySelector('.type')
    const content = menu_container.querySelector('.content')
    const worry = menu_container.querySelector('.worry')
    const bottle = menu_container.querySelector('.bottle')
    const glass = menu_container.querySelector('.glass')
    const reply_count = menu_container.querySelector('.reply-count')
    const title = worry.querySelector('.title')
    const story = worry.querySelector('.story')
    const alcoholsType = ['소 주', '맥 주', '막 걸 리', '와 인', '샴 페 인', '위 스 키']

    type.innerHTML = alcoholsType[this.state.index]
    bottle.src = '/assets/image/' + alcohols[this.state.index] + '.png'
    glass.src = '/assets/image/' + alcohols[this.state.index] + '-glass.png'

    request
      .get('/api/getMyWorry')
      .query({
        type: this.state.index,
        id: 'sangunp703'
      })
      .end((err, res) => {
        if (err) {
          return
        }
        if (res.body.msg === 'not exist') {
          worry.style.display = 'none'
          reply_count.style.display = 'none'
          content.removeEventListener('click', this.showGlass)
          content.removeEventListener('click', this.showWrite)
          content.addEventListener('click', this.showWrite)
          return
        }
        content.removeEventListener('click', this.showGlass)
        content.removeEventListener('click', this.showWrite)
        content.addEventListener('click', this.showGlass)
        worry.style.display = 'block'
        reply_count.style.display = 'block'
        reply_count.innerHTML = 'X ' + res.body.reply_count
        title.innerHTML = res.body.title
        story.innerHTML = res.body.story
      })
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

  render() {
    return (
      <div className='menu-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='background'>
          <div className='menu'>
            <h1 className='type'>M E N U</h1>
            <div className='content'>
              <div className='alcohol'>
                <img className='bottle' src='' alt='bottle' />
                <img className='glass' src='' alt='glass' />
                <span className='reply-count'>X 0</span>
              </div>
              <div className='worry'>
                <h2 className='title'>it's sad</h2>
                <pre className='story'>blah blah</pre>
              </div>
            </div>
            <img className='arrow-back' src='' alt='previous' onClick={e => this.previousMenu(e)} />
            <img className='arrow-next' src='' alt='next' onClick={e => this.nextMenu(e)} />
          </div>
        </div>
      </div>
    )
  }
}

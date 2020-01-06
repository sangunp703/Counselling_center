import React, { Component } from 'react'
import '../../style/css/menu.css'
import request from 'superagent'

export default class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
      index: 0
    }
  }

  componentDidUpdate() {
    if (this.props.show === 'menu') {
      document.querySelector('.menu-container').style.display = 'block'
    }
    const menu_container = document.querySelector('.menu-container')
    const worry = menu_container.querySelector('.worry')
    const bottle = menu_container.querySelector('.bottle')
    const glass = menu_container.querySelector('.glass')
    const reply_count = menu_container.querySelector('.reply-count')
    const title = worry.querySelector('.title')
    const story = worry.querySelector('.story')
    bottle.src = '../../assets/image/soju.png'
    glass.src = '../../assets/image/soju-glass.png'
    request
      .get('/api/getMyWorry')
      .query({
        type: this.state.index,
        id: 'sangunp703'
      })
      .end((err, res) => {
        if (res.body.msg === 'not exist') {
          worry.style.display = 'none'
          return
        }
        reply_count.innerHTML = 'X ' + res.body.reply_count
        title.innerHTML = res.body.title
        story.innerHTML = res.body.story
      })
  }

  closeBox(e) {
    this.props.showCallback('none')
    e.currentTarget.parentNode.style.display = 'none'
  }

  previousMenu(e) {
    if (index === 0) {
      index = 6
    } else {
      index -= 1
    }
    this.setState({
      type: alcohols[index]
    })
  }

  nextMenu(e) {
    if (index === 0) {
      index = 6
    } else {
      index -= 1
    }
    this.setState({
      type: alcohols[index]
    })
  }

  render() {
    return (
      <div className='menu-container'>
        <div className='layout' onClick={e => this.closeBox(e)}></div>
        <div className='background'>
          <div className='menu'>
            <h1>M E N U</h1>
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
            <img className='arrow-back' src='' alt='previous' />
            <img className='arrow-next' src='' alt='next' />
          </div>
        </div>
      </div>
    )
  }
}

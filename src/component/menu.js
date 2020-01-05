import React, { Component } from 'react'
import '../../style/css/menu.css'

export default class Menu extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    if (this.props.show === 'menu') {
      document.querySelector('.menu-container').style.display = 'block'
    }
  }

  closeBox(e) {
    this.props.showCallback('none')
    e.currentTarget.parentNode.style.display = 'none'
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

import React, { Component } from 'react'
import '../../style/css/glass.css'

export default class Write extends Component {
  constructor(props) {
    super(props)
  }

  closeBox(e) {
    this.props.showCallback('menu')
  }

  componentDidUpdate() {
    if (this.props.show === 'glass') {
      document.querySelector('.glass-container').style.display = 'block'
    } else {
      document.querySelector('.glass-container').style.display = 'none'
    }
  }

  render() {
    return (
      <div className='glass-container'>
        <div className='layout' onClick={e => this.closeBox(e)}>
          <div className='content'>
            <div className='grid'>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className='scroll-img'></div>
          </div>
        </div>
      </div>
    )
  }
}

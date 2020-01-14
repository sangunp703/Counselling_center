import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../style/css/intro.css'

export default class Intro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jump: ''
    }
  }

  closeDoor() {
    const left_door = document.querySelector('.left-door')
    const right_door = document.querySelector('.right-door')
    left_door.style.width = '50vw'
    right_door.style.width = '50vw'
  }

  enter() {
    this.closeDoor()
    setTimeout(e => {
      this.setState({ jump: '/check' })
    }, 1500)
  }

  animationEnd() {
    const intro_container = document.querySelector('.intro-container')
    const cover = intro_container.querySelector('.cover')
    cover.style.display = 'none'
  }

  render() {
    if (this.state.jump) {
      return <Redirect to={this.state.jump} />
    }
    return (
      <div className='intro-container'>
        <div className='cover'></div>
        <div className='intro-box' onClick={e => this.enter()}>
          <div className='title' onAnimationEnd={e => this.animationEnd()}>
            <span>술</span>
            <span>이</span>
            <br />
            <span>그</span>
            <span>대</span>
            <span>를</span>
            <br />
            <span>구</span>
            <span>원</span>
            <span>하</span>
            <span>리</span>
            <span>라</span>
          </div>
          <div class='image'>
            <svg viewBox='120 10 400 470' width='100%' height='100%'>
              <filter id='dropshadow' x='-10' y='-10' width='100' height='100'>
                <feGaussianBlur stdDeviation='12' />
              </filter>
              <g>
                <g transform='rotate(15.544978141784668 254.86335754394554,239.21194458007807) ' id='svg_46'>
                  <path class='shadow' d='m236,37l39,0l1,87c0,22 27,25 28,46c1,21 2,255 1,265c-1,10 -98,7 -100,0c-2,-7 1,-240 1,-264c0,-24 28,-26 29,-48c1,-22 0,-75 1,-86z' />
                  <path class='shadow' d='m205,366c0,15 100,13 100,-2c0,-15 -1,-153 -1,-138c0,15 -97,13 -97,-1c0,-14 -2,126 -2,141z' />
                  <path class='way' d='m236,37l39,0l1,87c0,22 27,25 28,46c1,21 2,255 1,265c-1,10 -98,7 -100,0c-2,-7 1,-240 1,-264c0,-24 28,-26 29,-48c1,-22 0,-75 1,-86z' />
                  <path class='way' d='m205,366c0,15 100,13 100,-2c0,-15 -1,-153 -1,-138c0,15 -97,13 -97,-1c0,-14 -2,126 -2,141z' />
                </g>
                <path class='shadow' d='m403,234l78,0c0,0 11,38 11,55c0,17 -8,37 -16,45c-8,8 -25,3 -25,21c0,18 -1,52 1,57c2,5 34,8 38,18c4,10 -102,12 -98,2c4,-10 41,-15 41,-20c0,-5 3,-40 -1,-58c-4,-18 -9,-9 -21,-19c-12,-10 -20,-26 -19,-46c1,-20 11,-55 11,-55z' />
                <path class='way' d='m403,234l78,0c0,0 11,38 11,55c0,17 -8,37 -16,45c-8,8 -25,3 -25,21c0,18 -1,52 1,57c2,5 34,8 38,18c4,10 -102,12 -98,2c4,-10 41,-15 41,-20c0,-5 3,-40 -1,-58c-4,-18 -9,-9 -21,-19c-12,-10 -20,-26 -19,-46c1,-20 11,-55 11,-55z' />
              </g>
            </svg>
          </div>
        </div>
      </div>
    )
  }
}

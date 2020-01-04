import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../style/css/main.css'
import Menu from './component/menu'

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jump: '',
      show: 'none'
    }
    this.showCallback = this.showCallback.bind(this)
  }

  showCallback(showData) {
    this.setState({
      show: showData
    })
  }

  openMenuBox(e) {
    this.setState({ show: 'menu' })
  }

  render() {
    if (this.state.jump) {
      return <Redirect to={this.state.jump} />
    }
    return (
      <div className='main-container'>
        <div className='layout-left'></div>
        <div className='layout-right'></div>
        <img className='bartender' src='' alt='bartender' />
        <img className='table' src='' alt='table'></img>
        <div className='menu' onClick={e => this.openMenuBox(e)}>
          MENU
        </div>
        <Menu show={this.state.show} showCallback={this.showCallback} />
      </div>
    )
  }
}
